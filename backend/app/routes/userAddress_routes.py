from flask import Blueprint, request
from flask_restful import Resource, Api
from controllers.userAddress_controller import UserAddressController
from flask_jwt_extended import jwt_required, get_jwt_identity 
from utility.utility import check_blacklist


address_routes = Blueprint('address_routes', __name__)
api = Api(address_routes)

#************************************************************************************************************************************
# class for handling individual address operations
class AddressResource(Resource):
    #----------------------------------------------------------------------------------------
    @jwt_required()
    @check_blacklist
    def get(self):
        try:
            address_id = request.args.get('address_id', type=int)
            if address_id is None:
                return {'error': 'Address ID is required'}, 400

            address = UserAddressController.get_address_by_id(address_id)
            return address
        except Exception as e:
            return {'error': str(e)}, 500
    #----------------------------------------------------------------------------------------    
    @jwt_required()
    @check_blacklist
    def put(self):
        try:
            data = request.get_json()
            address_id = request.args.get('address_id', type=int)
            
            if address_id is None:
                return {'error': 'Address ID is required'}, 400

            address = UserAddressController.update_address(address_id, data)
            return address
        except Exception as e:
            return {'error': str(e)}, 500
    #----------------------------------------------------------------------------------------
    
    @jwt_required()
    @check_blacklist
    def delete(self):
        try:
            address_id = request.args.get('address_id', type=int)
            if address_id is None:
                return {'error': 'Address ID is required'}, 400

            success = UserAddressController.delete_address(address_id)
            return success
        except Exception as e:
            return {'error': str(e)}, 500

#************************************************************************************************************************************
# class for adding a new address
class AddAddress(Resource):
    @jwt_required()
    @check_blacklist
    def post(self):
        try:
            data = request.get_json()
            current_user_id = get_jwt_identity()
            
            new_address = UserAddressController.create_address(current_user_id, data)
            return new_address
        except Exception as e:
            return {'error': str(e)}, 500
        
#************************************************************************************************************************************        /
#class for retrieving user addresses
class AddressListByUserResource(Resource):
    @jwt_required()
    @check_blacklist
    def get(self):
        try:
            current_user_id = get_jwt_identity()
            addresses = UserAddressController.get_addresses_by_user(current_user_id)
            return addresses
        except Exception as e:
            return {'error': str(e)}, 500
        











#************************************************************************************************************************************
# Register resources with the API
api.add_resource(AddressResource, '/addresses')
api.add_resource(AddAddress, '/addAddress')
api.add_resource(AddressListByUserResource, '/userAddresses')

#************************************************************************************************************************************