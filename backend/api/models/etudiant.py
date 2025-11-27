from django.db import models

class Etudiant(models.Model):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150)
    password = models.CharField(max_length=255)  # Hashed avec bcrypt
    ville= models.CharField(max_length=50)
    bac_type = models.CharField(max_length=50)  # Ex: "آداب", "رياضيات", etc.
    mg_principale = models.FloatField()  # Moyenne principale
    mg_controle = models.FloatField(null=True, blank=True)  # Moyenne contrôle
    mg = models.FloatField()  # Moyenne générale
    session = models.CharField(max_length=20)  # "principale" ou "controle"

    # Notes des matières (null=True pour les matières non concernées)
    A = models.FloatField(null=True, blank=True)      # Arabe
    PH = models.FloatField(null=True, blank=True)     # Philosophie
    HG = models.FloatField(null=True, blank=True)     # Histoire-Géo
    F = models.FloatField(null=True, blank=True)      # Français
    Ang = models.FloatField(null=True, blank=True)    # Anglais
    M = models.FloatField(null=True, blank=True)      # Mathématiques
    SP = models.FloatField(null=True, blank=True)     # Physique
    Sp_sport = models.FloatField(null=True, blank=True)
    SVT = models.FloatField(null=True, blank=True)    # Sciences de la vie et Terre
    Ge = models.FloatField(null=True, blank=True)     # Gestion
    Ec = models.FloatField(null=True, blank=True)     # Économie
    TE = models.FloatField(null=True, blank=True)     # Technologie
    Algo = models.FloatField(null=True, blank=True)   # Algorithmique
    STI = models.FloatField(null=True, blank=True) 
    Info= models.FloatField(null=True, blank=True)  # Sciences Tech Info
    SB = models.FloatField(null=True, blank=True)     # Sciences Bio (Sport)
    EP = models.FloatField(null=True, blank=True)     # Éducation physique
    IT = models.FloatField(null=True, blank=True)       # Italien
    ESP = models.FloatField(null=True, blank=True)      # Espagnol
    All = models.FloatField(null=True, blank=True)      # Allemand
     # Notes principales (pour les matières avec contrôle)
    A_principale = models.FloatField(null=True, blank=True)
    HG_principale = models.FloatField(null=True, blank=True)
    F_principale = models.FloatField(null=True, blank=True)
    Ang_principale = models.FloatField(null=True, blank=True)
    M_principale = models.FloatField(null=True, blank=True)
    SP_principale = models.FloatField(null=True, blank=True)
    Sp_sport_principale = models.FloatField(null=True, blank=True)
    SVT_principale = models.FloatField(null=True, blank=True)
    Ge_principale = models.FloatField(null=True, blank=True)
    Ec_principale = models.FloatField(null=True, blank=True)
    TE_principale = models.FloatField(null=True, blank=True)
    Algo_principale = models.FloatField(null=True, blank=True)
    STI_principale = models.FloatField(null=True, blank=True)
    Info_principale = models.FloatField(null=True, blank=True)
    SB_principale = models.FloatField(null=True, blank=True)
    EP_principale = models.FloatField(null=True, blank=True)

    # Notes de contrôle (pour les mêmes matières)
    A_controle = models.FloatField(null=True, blank=True)
    HG_controle = models.FloatField(null=True, blank=True)
    F_controle = models.FloatField(null=True, blank=True)
    Ang_controle = models.FloatField(null=True, blank=True)
    M_controle = models.FloatField(null=True, blank=True)
    SP_controle = models.FloatField(null=True, blank=True)
    Sp_sport_controle = models.FloatField(null=True, blank=True)
    SVT_controle = models.FloatField(null=True, blank=True)
    Ge_controle = models.FloatField(null=True, blank=True)
    Ec_controle = models.FloatField(null=True, blank=True)
    TE_controle = models.FloatField(null=True, blank=True)
    Algo_controle = models.FloatField(null=True, blank=True)
    STI_controle = models.FloatField(null=True, blank=True)
    Info_controle = models.FloatField(null=True, blank=True)
    SB_controle = models.FloatField(null=True, blank=True)
    EP_controle = models.FloatField(null=True, blank=True)
    fg = models.FloatField(null=True, blank=True)     # Formule globale (calculée)
    score = models.FloatField(null=True, blank=True)  # Score final d'orientation

    def __str__(self):
        return f"{self.username} - {self.bac_type}"
