from django.urls import path
from . import views

urlpatterns = [
    path('create-payment-intent/', views.create_payment_intent, name='create-payment-intent'),
    path('history/', views.payment_history, name='payment-history'),
    path('wallet/', views.wallet_info, name='wallet-info'),
    path('transactions/', views.transaction_history, name='transaction-history'),
    path('withdraw/', views.withdraw_funds, name='withdraw-funds'),
]
