from flask import jsonify
from models.db import db

class BlacklistToken(db.Model):
    __tablename__ = 'blacklist_token'

    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), unique=True, nullable=False)
  
  # ===========================================================
    def __init__(self, jti):
        self.jti = jti

  # ===========================================================
    @classmethod
    def insert(cls, p_jit): 
        new_blockToken = cls(jti=p_jit)   
        try:
            db.session.add(new_blockToken)
            db.session.commit()
            return True
        except Exception as e:
            db.session.rollback()
            raise
        
  # ===========================================================
    @classmethod
    def isTokenBlacklisted(cls, p_RawJit):
        try:
            if cls.query.filter_by(jti=p_RawJit).first():
                return True, jsonify({'message': 'Token is blacklisted'})
            else:
                return False, '' 
        except Exception as e:
            raise 
  # ===========================================================