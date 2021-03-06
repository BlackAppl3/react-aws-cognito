import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
  AuthenticationDetails
} from 'amazon-cognito-identity-js'
import poolData from '../cognito-pool-data'


const userPool = new CognitoUserPool(poolData)

export const createUser = (username, email, password, callback) => {
  const attributeList = [
    new CognitoUserAttribute({
      Name: 'email',
      Value: email
    }),
    new CognitoUserAttribute({
      Name: 'name',
      Value: username
    })
  ]

  // Username must be unique in a pool, and cant be a valid email format
  // To log in with email, make sure it is set as an alias attribute in Cognito
  // More info: http://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-attributes.html#user-pool-settings-usernames

  userPool.signUp(username, password, attributeList, null, callback)
}


export const verifyUser = (username, verifyCode, callback) => {
  const userData = {
    Username: username,
    Pool: userPool,
  }
  const cognitoUser = new CognitoUser(userData)
  cognitoUser.confirmRegistration(verifyCode, true, callback)
}

export const authenticateUser = (email, password, callback) => {
  const authData = {
    Username: email,
    Password: password,
  }
  const authDetails = new AuthenticationDetails(authData)
  const userData = {
    Username: email,
    Pool: userPool,
  }
  const cognitoUser = new CognitoUser(userData)
  cognitoUser.authenticateUser(authDetails, {
    onSuccess: result => {
      console.log('access token + ' + result.getAccessToken().getJwtToken())
      callback(null, result)
    },
    onFailure: err => {
      callback(err)
    }
  })
}

export const signOut = () => {
  userPool.getCurrentUser().signOut()
  window.location.reload()
}

export const getCurrentUser = (callback) => {
  const cognitoUser = userPool.getCurrentUser()
  if (!cognitoUser) return false;


  cognitoUser.getSession((err, session) => {
    if (err) {
      console.log(err)
      return
    }

    console.log('Session valid?', session.isValid())
    console.log(session)

    cognitoUser.getUserAttributes((err, attributes) => {
      if (err) return console.log(err);
      callback(attributes)
    })
  })
}

export function resetPassword(username){
console.log("------------------")
console.log(username)
  const userData = {
    Username: username,
    Pool: userPool
  }

  const cognitoUser = new CognitoUser(userData)



  cognitoUser.forgotPassword({
    onSuccess: function(result) {
        console.log('call result: ' + result);
    },
    onFailure: function(err) {
        alert(err);
    },
    inputVerificationCode() {}
  });
}



export function changePassword(username, verificationCode){
  console.log("*******", verificationCode)

  const userData = {
    Username: username,
    Pool: userPool
  }
  

  const cognitoUser = new CognitoUser(userData)

  cognitoUser.confirmPassword(verificationCode, "12345678qw", {
    onSuccess: function(result) {
      console.log('call result: ' + result);
    },
    onFailure: function(err) {
      alert(err);
    },
});        
}


export function deleteUser(){
  const cognitoUser = userPool.getCurrentUser()
  if (!cognitoUser) return false;


  cognitoUser.getSession((err, session) => {
    if (err) {
      console.log(err)
      return
    }
  });


  cognitoUser.deleteUser(function (err, result) {
      if (err) {
          alert(err);
          return;
      }
      console.log('user delete result: ' + result);
      window.reload();
  });
}