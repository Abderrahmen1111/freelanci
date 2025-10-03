from django.urls import path
from . import views

urlpatterns = [
    path('create-payment-intent/', views.create_payment_intent, name='create-payment-intent'),
    path('d17/create/', views.create_d17_payment, name='d17-create'),
    path('d17/callback/', views.d17_callback, name='d17-callback'),
    path('d17/status/', views.d17_status, name='d17-status'),
    path('history/', views.payment_history, name='payment-history'),
    path('wallet/', views.wallet_info, name='wallet-info'),
    path('transactions/', views.transaction_history, name='transaction-history'),
    path('withdraw/', views.withdraw_funds, name='withdraw-funds'),
]
