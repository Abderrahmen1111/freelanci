from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.conf import settings
import stripe
import qrcode
import io
import base64
import time
from .models import Payment, Wallet, Transaction

stripe.api_key = settings.STRIPE_SECRET_KEY

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def create_payment_intent(request):
    try:
        amount = int(float(request.data.get('amount', 0)) * 100)  # Convertir en centimes
        currency = request.data.get('currency', 'eur')
        
        intent = stripe.PaymentIntent.create(
            amount=amount,
            currency=currency,
            automatic_payment_methods={"enabled": True},
            metadata={
                'user_id': request.user.id,
                'payment_type': request.data.get('payment_type', 'service')
            }
        )
        
        # Créer l'enregistrement de paiement
        payment = Payment.objects.create(
            user=request.user,
            payment_type=request.data.get('payment_type', 'service'),
            amount=request.data.get('amount'),
            currency=currency.upper(),
            stripe_payment_intent_id=intent.id,
            description=request.data.get('description', ''),
            metadata=request.data.get('metadata', {})
        )
        
        return Response({
            'client_secret': intent.client_secret,
            'payment_id': payment.id
        })
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def create_d17_payment(request):
    """
    Simule la création d'un paiement D17 en générant un QR code encodant
    une charge de paiement. Retourne une image PNG en base64 et une référence.
    """
    try:
        amount = float(request.data.get('amount', 0))
        currency = (request.data.get('currency') or 'TND').upper()
        payment_type = request.data.get('payment_type', 'service')
        description = request.data.get('description', '')

        if amount <= 0:
            return Response({'error': 'Montant invalide'}, status=status.HTTP_400_BAD_REQUEST)

        # Référence unique D17 (à remplacer par la vraie référence fournie par l’agrégateur D17)
        reference = f"D17_{request.user.id}_{int(time.time())}"

        # Payload D17 simplifié (placeholder). A remplacer par le format officiel.
        payload = f"D17|MERCHANT=FREELANCII|AMOUNT={amount:.2f}|CURRENCY={currency}|REF={reference}"

        # Générer le QR code en PNG (base64)
        qr_image = qrcode.make(payload)
        buffer = io.BytesIO()
        qr_image.save(buffer, format='PNG')
        qr_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')

        # Enregistrer le paiement en base
        payment = Payment.objects.create(
            user=request.user,
            payment_type=payment_type,
            amount=amount,
            currency=currency,
            status='pending',
            description=description,
            metadata={
                'd17_reference': reference,
                'd17_qr_payload': payload,
            },
        )

        return Response({
            'payment_id': payment.id,
            'reference': reference,
            'qr_base64': qr_base64,
            'amount': amount,
            'currency': currency,
            'status': payment.status,
        })
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def d17_callback(request):
    """
    Point d’entrée callback pour D17 (webhook). Met à jour le statut du paiement.
    En production, vérifier la signature fournie par l’agrégateur.
    """
    try:
        payment_id = request.data.get('payment_id')
        reference = request.data.get('reference')
        status_param = (request.data.get('status') or '').lower()

        payment = None
        if payment_id:
            try:
                payment = Payment.objects.get(id=payment_id)
            except Payment.DoesNotExist:
                pass
        if payment is None and reference:
            payment = Payment.objects.filter(metadata__d17_reference=reference).first()

        if payment is None:
            return Response({'error': 'Paiement introuvable'}, status=status.HTTP_404_NOT_FOUND)

        if status_param in ['completed', 'succeeded', 'success', 'paid']:
            payment.status = 'completed'
        elif status_param in ['failed', 'canceled', 'cancelled', 'error']:
            payment.status = 'failed'
        else:
            # Par défaut, on considère succès si non précisé (en sandbox)
            payment.status = 'completed'

        payment.save()

        return Response({'ok': True, 'payment_id': payment.id, 'status': payment.status})
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def d17_status(request):
    """
    Récupère le statut d’un paiement D17 via payment_id ou référence.
    """
    try:
        payment_id = request.query_params.get('payment_id')
        reference = request.query_params.get('reference')

        payment = None
        if payment_id:
            try:
                payment = Payment.objects.get(id=payment_id, user=request.user)
            except Payment.DoesNotExist:
                pass
        if payment is None and reference:
            payment = Payment.objects.filter(user=request.user, metadata__d17_reference=reference).first()

        if payment is None:
            return Response({'error': 'Paiement introuvable'}, status=status.HTTP_404_NOT_FOUND)

        return Response({
            'payment_id': payment.id,
            'reference': payment.metadata.get('d17_reference'),
            'status': payment.status,
            'amount': payment.amount,
            'currency': payment.currency,
            'created_at': payment.created_at,
        })
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def payment_history(request):
    payments = Payment.objects.filter(user=request.user)
    data = []
    for payment in payments:
        data.append({
            'id': payment.id,
            'amount': payment.amount,
            'currency': payment.currency,
            'status': payment.status,
            'payment_type': payment.payment_type,
            'description': payment.description,
            'created_at': payment.created_at
        })
    return Response(data)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def wallet_info(request):
    wallet, created = Wallet.objects.get_or_create(user=request.user)
    return Response({
        'balance': wallet.balance,
        'pending_balance': wallet.pending_balance,
        'total_earned': wallet.total_earned,
        'total_withdrawn': wallet.total_withdrawn
    })

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def transaction_history(request):
    wallet, created = Wallet.objects.get_or_create(user=request.user)
    transactions = wallet.transactions.all()[:20]  # 20 dernières transactions
    
    data = []
    for transaction in transactions:
        data.append({
            'id': transaction.id,
            'type': transaction.transaction_type,
            'amount': transaction.amount,
            'description': transaction.description,
            'reference': transaction.reference,
            'created_at': transaction.created_at
        })
    
    return Response(data)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def withdraw_funds(request):
    try:
        amount = float(request.data.get('amount', 0))
        wallet = request.user.wallet
        
        if amount > wallet.balance:
            return Response({'error': 'Solde insuffisant'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Créer la transaction de retrait
        Transaction.objects.create(
            wallet=wallet,
            transaction_type='debit',
            amount=amount,
            description='Retrait de fonds',
            reference=f'WITHDRAW_{wallet.user.id}_{int(time.time())}'
        )
        
        # Mettre à jour le solde
        wallet.balance -= amount
        wallet.total_withdrawn += amount
        wallet.save()
        
        return Response({'message': 'Retrait effectué avec succès'})
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
