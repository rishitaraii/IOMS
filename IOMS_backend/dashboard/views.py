from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Sum, Count
from django.db.models.functions import TruncMonth
from datetime import datetime
from orders.models import Orders, OrderItem
from inventory.models import Product
from customers.models import Customer
from dateutil.relativedelta import relativedelta

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def dashboard_metrics(request):
    now = datetime.now()
    previous_month_date = now - relativedelta(months=1)
    current_month_orders = Orders.objects.filter(date__year=now.year, date__month=now.month)

    total_orders = current_month_orders.count()
    total_revenue = current_month_orders.aggregate(total=Sum("total_price"))["total"] or 0

    prev_orders = Orders.objects.filter(date__year=previous_month_date.year, date__month=previous_month_date.month)
    prev_revenue = prev_orders.aggregate(total=Sum("total_price"))["total"] or 0
    prev_total_orders = prev_orders.count()

    low_stock = Product.objects.filter(stock_quantity__lte=10).values("id", "name", "stock_quantity")
    inactive_products = Product.objects.filter(status="inactive").values("id", "name")

    top_products = (
        OrderItem.objects
        .filter(order__date__year=now.year, order__date__month=now.month)
        .values("product__name")
        .annotate(quantity=Sum("quantity"))
        .order_by("-quantity")[:5]
    )

    top_customers = (
        Orders.objects
        .filter(date__year=now.year, date__month=now.month)
        .values("customer__name")
        .annotate(total_spent=Sum("total_price"))
        .order_by("-total_spent")[:5]
    )

    monthly_revenue_qs = (
        Orders.objects
        
        .annotate(month=TruncMonth("date"))
        .values("month")
        .annotate(total=Sum("total_price"))
        .order_by("month")
    )

    monthly_revenue = [
        {
            "month": item["month"].strftime("%b"),
            "revenue": item["total"]
        }
        for item in monthly_revenue_qs
    ]

    total_products= Product.objects.count()
    total_customers = Customer.objects.count()

    return Response({
        "total_orders": total_orders,
        "prev_total_orders": prev_total_orders,
        "total_revenue": total_revenue,
        "prev_total_revenue": prev_revenue,
        "low_stock": list(low_stock),
        "inactive_products": list(inactive_products),
        "top_products": list(top_products),
        "top_customers": list(top_customers),
        "monthly_revenue": monthly_revenue,
        "total_products": total_products,
        "total_customers": total_customers
    })
