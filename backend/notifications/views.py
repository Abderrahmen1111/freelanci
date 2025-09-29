from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import Notification

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def notifications_list(request):
    notifications = Notification.objects.filter(user=request.user)[:20]
    data = []
    for notification in notifications:
        data.append({
            'id': notification.id,
            'type': notification.notification_type,
            'title': notification.title,
            'message': notification.message,
            'is_read': notification.is_read,
            'metadata': notification.metadata,
            'created_at': notification.created_at
        })
    return Response(data)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def mark_as_read(request, notification_id):
    try:
        notification = Notification.objects.get(id=notification_id, user=request.user)
        notification.is_read = True
        notification.save()
        return Response({'message': 'Notification marquée comme lue'})
    except Notification.DoesNotExist:
        return Response({'error': 'Notification non trouvée'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def mark_all_as_read(request):
    Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
    return Response({'message': 'Toutes les notifications marquées comme lues'})

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def unread_count(request):
    count = Notification.objects.filter(user=request.user, is_read=False).count()
    return Response({'count': count})

@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def delete_notification(request, notification_id):
    """Supprimer une notification"""
    try:
        notification = Notification.objects.get(id=notification_id, user=request.user)
        notification.delete()
        
        return Response({
            'success': True,
            'message': 'Notification supprimée'
        })
    except Notification.DoesNotExist:
        return Response({
            'success': False,
            'error': 'Notification non trouvée'
        }, status=status.HTTP_404_NOT_FOUND)
