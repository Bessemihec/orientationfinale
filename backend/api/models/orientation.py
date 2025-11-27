from django.db import models


class Orientation(models.Model):

    id = models.CharField(primary_key=True, max_length=50)    
    category = models.CharField(max_length=255)
    degree = models.CharField(max_length=255)
    institution = models.CharField(max_length=255)
    specialties = models.CharField(max_length=255)
    code = models.IntegerField()
    bac_type = models.CharField(max_length=50)
    calculation_format = models.CharField(max_length=50)
    last_year_score = models.CharField(max_length=50)
    gender = models.CharField(max_length=50)
    matiere_principale= models.CharField(max_length=50)
    test=models.CharField(max_length=10)
    geographic_preference = models.CharField(max_length=50)
    region = models.CharField(max_length=100)
    class Meta:
        managed = False
        db_table = "orientationfinale"  # Nom exact de la collection MongoDB