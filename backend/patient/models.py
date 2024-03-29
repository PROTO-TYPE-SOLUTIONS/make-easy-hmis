from datetime import datetime
from django.db import models
from customuser.models import CustomUser
# from pharmacy.models import Drug
from inventory.models import Item
from django.dispatch import receiver
from django.contrib.auth import get_user_model

# User = get_user_model()

class InsuranceCompany(models.Model):
    name = models.CharField(max_length=30)

    def __str__(self):
        return self.name


class ContactDetails(models.Model):
    tel_no = models.IntegerField()
    email_address = models.EmailField()
    residence = models.CharField(max_length=30)


class Patient(models.Model):
    GENDER_CHOICES = (
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    )
    first_name = models.CharField(max_length=40)
    email = models.EmailField(unique=True, null=True, blank=True)
    phone = models.CharField(max_length=30, null=True, blank=True)
    second_name = models.CharField(max_length=40)
    date_of_birth = models.DateField(null=True)
    email = models.EmailField(null=True)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, null=True)
    insurance = models.ForeignKey(
        InsuranceCompany, on_delete=models.CASCADE, null=True, blank=True)
    user = models.OneToOneField(
        CustomUser, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return self.first_name
    
    @property
    def age(self):
        if self.date_of_birth:
            patient_age:int = (datetime.now().year - self.date_of_birth.year)
            return patient_age
        return None


class NextOfKin(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=40)
    second_name = models.CharField(max_length=40)
    relationship = models.CharField(max_length=40)   
    contacts = models.ForeignKey(ContactDetails, on_delete=models.CASCADE)


class Appointment(models.Model):
    class Meta:
        ordering = ("-date_created",)

    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    )
    appointment_date_time = models.DateTimeField(null=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    assigned_doctor = models.ForeignKey(
        CustomUser, on_delete=models.SET_NULL, null=True, blank=True)
    status = models.CharField(
        max_length=10, choices=STATUS_CHOICES, default='pending')
    reason = models.TextField(max_length=300, null=True)
    date_created = models.DateTimeField(auto_now_add=True)
    date_changed = models.DateTimeField(auto_now=True)
    item = models.ForeignKey(Item, on_delete=models.CASCADE, null=True, default=22)

    def __str__(self):
        return f"Appointment #{self.patient.first_name}"



class PublicAppointment(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
    )
    GENDER_CHOICES = (
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    )
    item = models.ForeignKey(Item, on_delete=models.CASCADE, null=True)
    first_name = models.CharField(max_length=40)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=30, null=True, blank=True)
    second_name = models.CharField(max_length=40)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES,)
    email = models.EmailField()
    phone_number = models.CharField(max_length=15)
    appointment_date_time = models.DateTimeField()
    status = models.CharField(
        max_length=10, choices=STATUS_CHOICES, default='pending')
    reason = models.TextField(max_length=300,)
    date_created = models.DateTimeField(auto_now_add=True)
    date_changed = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Appointment #{self.first_name}"
    
    @property
    def age(self):
        if self.date_of_birth:
            patient_age:int = (datetime.now().year - self.date_of_birth.year)
            return patient_age
        return None


class Triage(models.Model):
    created_by = models.CharField(max_length=45)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    date_created = models.DateTimeField(auto_now_add=True)
    temperature = models.DecimalField(max_digits=5, decimal_places=2)
    height = models.DecimalField(max_digits=5, decimal_places=2)
    weight = models.IntegerField()
    pulse = models.PositiveIntegerField()
    fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    notes = models.CharField(max_length=300, blank=True)


class Consultation(models.Model):
    DISPOSITION_CHOICES = (
        ('admitted', 'Admitted'),
        ('referred', 'Referred'),
        ('discharged', 'Discharged'),
        ('lab', 'Lab'),
    )
    doctor = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    date_created = models.DateTimeField(auto_now_add=True)
    note = models.TextField(null=True, blank=True)
    complaint = models.TextField(null=True, blank=True)
    fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    disposition = models.CharField(
        max_length=10, choices=DISPOSITION_CHOICES, default="")
    
    def __str__(self):
        return self.note


class Prescription(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('dispensed', 'Dispensed'),
    )
    date_created = models.DateTimeField(auto_now_add=True)
    start_date = models.DateField()
    created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    status = models.CharField(
        max_length=10, choices=STATUS_CHOICES, default='pending')

    def __str__(self):
        return f"Prescription #{self.id}"


class PrescribedDrug(models.Model):
    class Meta:
        unique_together = ("prescription_id", "item")
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    prescription = models.ForeignKey(Prescription, on_delete=models.CASCADE, null=True)
    dosage = models.CharField(max_length=45)
    frequency = models.CharField(max_length=45)
    duration = models.CharField(max_length=45)
    note = models.TextField(null=True, blank=True)
    item = models.ForeignKey(Item, on_delete=models.CASCADE,)


    def __str__(self):
        return f"Prescribed Drug #{self.item.name}"    
        

class Referral(models.Model):
    SERVICE = (
        ('general', 'General'),
        ('dentist', 'Dentist'),
        ('cardiologist', 'Cardiologist'),
        ('neurologist', 'Neurologist'),
        ('orthopedist', 'Orthopedist'),
        ('psychiatrist', 'Psychiatrist'),
        ('surgeon', 'Surgeon'),
        ('physiotherapist', 'Physiotherapist'),
    )
    date_created = models.DateTimeField(auto_now_add=True)
    note = models.TextField(null=True, blank=True)
    referred_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    service = models.CharField(max_length=50, choices=SERVICE, default='general')
    email = models.EmailField()

    def __str__(self):
        return f"Referral #{self.patient_id}"
    
    def set_referred_by(self, CustomUser):
        self.referred_by = CustomUser

    def save(self, *args, **kwargs):
        if not self.pk:
            if not self.referred_by:
                raise ValueError("You must set the 'referred_by' user before saving.")
        super().save(*args, **kwargs)

