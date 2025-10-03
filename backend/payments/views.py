from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.conf import settings
import stripe
from .models import Payment, Wallet, Transaction
import time

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
