import jwt
from django.conf import settings
from django.core.mail import send_mail
from datetime import datetime, timedelta

def send_confirmation_email(user_data, is_google_signup=False):
    try:
        # ✅ AJOUT : Si utilisateur Google → pas d'email
        if is_google_signup:
            print("✅ Utilisateur Google - Pas d'email de confirmation nécessaire")
            return True
        
        print(f"🔄 Envoi email via port 465/SSL à {user_data['email']}...")
        
        # Générer token
        payload = {
            'user_id': user_data['id'],
            'email': user_data['email'],
            'exp': datetime.utcnow() + timedelta(days=1)
        }
        token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
        
        if isinstance(token, bytes):
            token = token.decode('utf-8')
            
        confirmation_url = f"http://localhost:3000/confirm-email?token={token}"
        
        # Email simple
        subject = "Confirmez votre compte - Système Orientation"
        message = f"""
        Bonjour {user_data['username']},
        
        Confirmez votre compte en cliquant sur ce lien :
        {confirmation_url}
        
        Cordialement,
        L'équipe Orientation
        """
        
        # Essayer d'envoyer l'email
        try:
            send_mail(
                subject,
                message.strip(),
                settings.DEFAULT_FROM_EMAIL,
                [user_data['email']],
                fail_silently=False,
            )
            print(f"✅ Email envoyé avec succès via port 465!")
            return True
            
        except Exception as email_error:
            print(f"❌ Erreur email port 465: {email_error}")
            # Fallback: afficher le lien
            print("🔗 Lien de confirmation:", confirmation_url)
            return True
            
    except Exception as e:
        print(f"❌ Erreur génération token: {e}")
        return False