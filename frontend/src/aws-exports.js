import { Auth } from 'aws-amplify';
//https://stackoverflow.com/questions/56462796/how-to-generate-aws-exports-js-with-existing-user-pool-in-aws-cognito

const awsconfig = {
  "aws_project_region": "us-east-1",
  "aws_cognito_identity_pool_id": "us-east-1:36c2b365-9cf2-4755-aed6-81f38f1f0932",
  "aws_cognito_region": "us-east-1",
  "aws_user_pools_id": "us-east-1_dTzu0ca19",
  "aws_user_pools_web_client_id": "3d4f2jpraivghscef74rclmtna",
  "oauth": {
      "domain": "oauthdemo7989752e-7989752e-dev.auth.us-east-1.amazoncognito.com",
      "scope": [
          "phone",
          "email",
          "openid",
          "profile",
          "aws.cognito.signin.user.admin"
      ],
      "redirectSignIn": "http://localhost:3000/,https://dh4onp0fvmvf4.cloudfront.net/",
      "redirectSignOut": "http://localhost:3000/,https://dh4onp0fvmvf4.cloudfront.net/",
      "responseType": "code"
  },
  "federationTarget": "COGNITO_USER_POOLS",
  "aws_cognito_username_attributes": [],
  "aws_cognito_social_providers": [
      "GOOGLE"
  ],
  "aws_cognito_signup_attributes": [
      "EMAIL"
  ],
  "aws_cognito_mfa_configuration": "OFF",
  "aws_cognito_mfa_types": [
      "SMS"
  ],
  "aws_cognito_password_protection_settings": {
      "passwordPolicyMinLength": 8,
      "passwordPolicyCharacters": []
  },
  "aws_cognito_verification_mechanisms": [
      "EMAIL"
  ],
  API: {
    endpoints: [
      {
         name: 'S3SignedURLAPI',
         endpoint: 'https://naizibwmgd.execute-api.us-east-1.amazonaws.com/prod',
         custom_header: async () => {
           return { Authorization: `${(await Auth.currentSession()).getIdToken().getJwtToken()}` }
         }
        },
    ]
  }
};


export default awsconfig;
