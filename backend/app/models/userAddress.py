from models.db import db, sql_text


class UserAddress(db.Model):
    __tablename__ = 'user_Address'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    street = db.Column(db.String(255), nullable=False)
    city = db.Column(db.String(255), nullable=False)
    state = db.Column(db.String(255), nullable=False)
    zip_code = db.Column(db.String(20), nullable=False)
    isActive = db.Column(db.String(1),default='Y' ,nullable=False)

    user = db.relationship('User', back_populates='addresses')


#===============================================================================
    @classmethod
    def create_address(cls, p_user_id, p_street, p_city, p_state, p_zip_code):
        new_address = cls(user_id=p_user_id, street=p_street, city=p_city, 
                          state=p_state, zip_code=p_zip_code)
        try:
            db.session.add(new_address)
            db.session.commit()
            return new_address
        except Exception as e:
            db.session.rollback()
            raise

#===============================================================================
    @classmethod
    def get_address_by_id(cls, p_address_id):
        try:
            address = cls.query.filter_by(id=p_address_id, isActive='Y').first();
            if address:
                    return address, None
            else:
                error_message = f"address with ID {p_address_id} not found."
                return None, error_message

        except Exception as e:
            raise

#===============================================================================
    @classmethod
    def get_address_by_userid(cls, p_user_id):
        try:
            address = cls.query.filter_by(user_id=p_user_id, isActive='Y').all()
            if address:
                    return address, None
            else:
                error_message = f"address with User ID {p_user_id} not found."
                return None, error_message

        except Exception as e:
            raise

# ===============================================================================
    def update_address(self, p_street=None, p_city=None, p_state=None, p_zip_code=None):
        # Checking if any fields have changed
        if (
            (p_street is not None and p_street != self.street) or
            (p_city is not None and p_city != self.city) or
            (p_state is not None and p_state != self.state) or
            (p_zip_code is not None and p_zip_code != self.zip_code)
        ):
            # Update the fields
            if p_street is not None:
                self.street = p_street
            if p_city is not None:
                self.city = p_city
            if p_state is not None:
                self.state = p_state
            if p_zip_code is not None:
                self.zip_code = p_zip_code

            try:
                db.session.commit()
                return self
            except Exception as e:
                db.session.rollback()
                raise
        else:
            # No changes return False
            return False
# ===============================================================================
   
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




#===============================================================================
    @classmethod
    def delete_address(cls, p_address):
        try:
            db.session.delete(p_address)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            raise


#=============================================================================== 
    def mark_delete_address(self):
        #Mark an address as deleted by updating its 'isActive' status.
        try:
            self.isActive = 'N',
            db.session.commit()
            return self
        except Exception as e:
            db.session.rollback()
            raise

