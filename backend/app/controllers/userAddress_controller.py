from models.user import UserAddress


class UserAddressController:
     # ==================================================================================
    @staticmethod
    def create_address(p_user_id, p_data):
        #Creates a new address for the specified user.
        try:
            street = p_data.get('street')
            city = p_data.get('city')
            state = p_data.get('state')
            zip_code = p_data.get('zip_code')
             # Create the address 
            address = UserAddress.create_address(p_user_id, street, city, state, zip_code)
            if address:
               # Return a list containing the created address data
               return [ {
                    'addressId': address.id,
                    'street': address.street,
                    'city': address.city,
                    'state': address.state,
                    'zip_code': address.zip_code
                }, ]
           
        except Exception as e:
            return {'error': str(e)}, 500
    
   # ==================================================================================
    @staticmethod
    def get_address_by_id(p_addressId):
        #Retrieves address information based on the provided address ID.
        try: 
             # Attempt to retrieve the address by ID
            address, error_message= UserAddress.get_address_by_id(p_addressId)
            # Check if the address is found
            if address:
                return UserAddressController.build_json_Address_data(address)
            else:
                 # Return a JSON response with an error message if the address is not found
                return {'error': error_message}, 404
        except Exception as e:
            return {'error': str(e)}, 500


   # ==================================================================================
    @staticmethod
    def update_address(p_addressId, p_data):
        #Updates the address information based on the provided address ID.
        try:
            street = p_data.get('street')
            city = p_data.get('city')
            state = p_data.get('state')
            zip_code = p_data.get('zip_code')

            # Retrieve the address by ID
            address, error_message = UserAddress.get_address_by_id(p_addressId)
            if not address:
                return {'message': error_message}

            # Check if any fields are provided
            if not any([street, city, state,zip_code]):
                return {'message': 'No fields provided for update'}

              # Update the address and check for success
            success = address.update_address(street, city, state, zip_code)
            if success:
                return [ {
                    'addressId': address.id,
                    'street': address.street,
                    'city': address.city,
                    'state': address.state,
                    'zip_code': address.zip_code
                }, ]
            else:
                return { 'message': 'Address not updated '}, 500

        except Exception as e:
            return {'error': str(e)}, 500

    # ==================================================================================
    @staticmethod
    def delete_address(p_addressId):
        # Deletes an address based on the provided address ID.
        try:
            # # Define the SQL query to update the 'isActive' status
            query = "UPDATE user_Address SET isActive = :is_active WHERE id = :addressId;"
            
            # Set parameters for the query
            params = {"is_active": "N", "addressId": p_addressId} 
            # Execute the  query 
            result = UserAddress.execute_custom_query(query, params);
            if result:
                return{'message': 'Address deleted successfully'},201
           
        except Exception as e:
            return {'error': str(e)}, 500

   
    # ==================================================================================
    @staticmethod
    def build_json_Address_data(addresses):
        #Builds a list of dictionaries containing JSON representation of addresses.
        addresses_data = []
         # Iterate through the provided list of addresses
        for address in addresses:
            address_data = {
                    'addressId': address.id,
                    'street': address.street,
                    'city': address.city,
                    'state': address.state,
                    'zip_code': address.zip_code
            }
            addresses_data.append(address_data);

        return addresses_data;
    
    # ==================================================================================
    @staticmethod
    def get_addresses_by_user(p_user_id):
        #Retrieves addresses associated with a specific user.
        try: 
            # retrieve addresses by user ID
            address, error_message= UserAddress.get_address_by_userid(p_user_id)
            if address:
                # Return a list of dictionaries representing address data
                return UserAddressController.build_json_Address_data(address)
            else:
                return {'error': error_message}, 404
        except Exception as e:
            return {'error': str(e)}, 500