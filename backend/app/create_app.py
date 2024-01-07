from flask import Flask
from flask_mail import Mail
from flask_jwt_extended import JWTManager
from models.db import db
from datetime import  timedelta



def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'gjfcjhgchjg675765hkj056hg'
    app.config['SESSION_COOKIE_SECURE'] = True  
    app.config['SESSION_COOKIE_SAMESITE'] = 'None' 

    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:Waliur#12@localhost:3306/USER_AUTH'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    app.config['JWT_SECRET_KEY'] = 'wakjb56vfdbfdj546bkjgfnbk65378fjiutl'  
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=15)  # access token expiration time
    app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=1)  # refresh token expiration time 

    app.config['MAIL_SERVER'] = 'smtp.gmail.com'
    app.config['MAIL_PORT'] = 587
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USERNAME'] = "userotp.mail@gmail.com"
    app.config['MAIL_PASSWORD'] = "apfkjcjgassczlgl"
    app.config['MAIL_DEFAULT_SENDER'] = "noreply@userapp.com"

    
    # Initialize mail 
    mail = Mail(app)


    # Initialize SQLAlchemy
    db.init_app(app)

    # Initialize JWTManager
    jwt = JWTManager(app)

   

    return app
