from models.db import db, sql_text
from werkzeug.security import generate_password_hash
from .userAddress import UserAddress




class User(db.Model):
    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True,nullable=False)
    
     #relationship to the UserAddress model
    addresses = db.relationship('UserAddress', back_populates='user', cascade='all')


    # ============================================================
    @classmethod
    def create(cls, username, password, email):
        hashed_password = generate_password_hash(password)
        new_user = cls(username=username, password=hashed_password, email=email)
        
        try:
            db.session.add(new_user)
            db.session.commit()
            return True, new_user, None
        except Exception as e:
            db.session.rollback()
            raise
        
    # ============================================================
    @classmethod
    def get_by_id(cls, user_id):
        try:
            user = cls.query.filter_by(id=user_id).first()
            if user:
                 # Filter the addresses based on isActive = 'Y'
                active_addresses = [address for address in user.addresses if address.isActive == 'Y']
                user.addresses = active_addresses
                return user, None
            else:
                error_message = f"User with ID {user_id} not found."
                return None, error_message
        except Exception as e:
             raise
        
    # ============================================================
    @classmethod
    def get_by_email(cls, p_email):
        try:
            user = cls.query.filter_by(email=p_email).first()
            if user:
                return user, None
            else:
                error_message = f"User with email {p_email} not found."
                return None, error_message
        except Exception as e:
             raise

        
  # ============================================================
    def update(self, p_new_username=None, p_new_password=None, p_new_email=None):
        # Check if any fields have changed
        if (
            (p_new_username is not None and p_new_username != self.username) or
            (p_new_password is not None and p_new_password != self.password) or
            (p_new_email is not None and p_new_email != self.email)
        ):
            # Update the fields
            if p_new_username is not None:
                self.username = p_new_username
            if p_new_password is not None:
                self.password = generate_password_hash(p_new_password)
            if p_new_email is not None:
                self.email = p_new_email

            try:
                db.session.commit()
                return self
            except Exception as e:
                db.session.rollback()
                raise
        else:
            # No changes, return False
            return False

   
    # ============================================================
    def delete(self):
        try:
            db.session.delete(self)
            db.session.commit()
            return True
        except Exception as e:
            db.session.rollback()
            raise

    # ============================================================
    
    def update_password(self, new_password):
        self.password = generate_password_hash(new_password)

        try:
            db.session.commit()
            return True
        except Exception as e:
            db.session.rollback()
            raise
       

#===============================================================================
    @classmethod
    def execute_custom_query(cls, p_query, p_params=None):
        try:
            if p_params is None:
                result = db.session.execute(sql_text(p_query));
            else:
                result = db.session.execute(sql_text(p_query), p_params);
            
            db.session.commit();
            return result;
        except Exception as e:
            db.session.rollback();
            raise