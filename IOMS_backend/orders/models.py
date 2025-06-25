from django.db import models
from customers.models import Customer
from inventory.models import Product

# Create your models here.
class Orders(models.Model):
    STATUS ={
        ('Pending', 'Pending'),
        ('Processing', 'Processing'),
        ('Shipped', 'Shipped'),
        ('Delivered', 'Delivered'),
        ('Cancelled', 'Cancelled'), 
    }
    order_id = models.AutoField(primary_key=True)
    customer= models.ForeignKey(Customer, on_delete=models.CASCADE, null=True, blank=True)
    date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS, default='Pending')
    total_items = models.PositiveIntegerField(default=0)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def update_totals(self):
        self.total_items = sum(item.quantity for item in self.items.all())
        self.total_price = sum(item.product.price * item.quantity for item in self.items.all())
        self.save()

class OrderItem(models.Model):
    order=models.ForeignKey(Orders, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)  
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} x {self.product.name} (Order {self.order.order_id})"
    
