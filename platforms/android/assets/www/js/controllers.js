var abc = 0;
angular.module('starter.controllers', ['myservices'])

.controller('AppCtrl', function($scope, $ionicScrollDelegate,$state,$timeout,$ionicHistory,$ionicPopup) {

    // if ($scope.name = localStorage.getItem('estate_role') == 'resident') {
    //   $scope.hideSub = true;
    // } else{

    //   $scope.hideSub = false;

    // };


    $scope.Logout = function(){
      var confirmPopup = $ionicPopup.confirm({
       title: '<b> <font color=blue>Sign out?</font></b>',
       template: 'Are you sure you want to Sign out?',
        buttons: [
              { text: 'No', type:"button-assertive" },
              {
               text: '<b>Yes</b>',
               type: 'button-positive',
               onTap: function(res) {
            
                  if (res) {
                  $timeout(function () {
                  $ionicHistory.clearCache();
                  $ionicHistory.clearHistory();
                  $ionicHistory.nextViewOptions({ disableBack: true, historyRoot: true });
                  localStorage.removeItem('estate_name');
                  localStorage.removeItem('estate_address');
                  localStorage.removeItem('estate_role');
                  localStorage.removeItem('estate_api_token');
                  localStorage.removeItem('estate_id');

        $state.go('user-login');
        }, 30);

                  } else {
                    console.log('hey');
                  }
               }
            }
        ]
     });



      

     };

    $scope.name = localStorage.getItem('estate_name');
  $scope.address = localStorage.getItem('estate_address');

})

.controller('ArticlesCtrl', function($scope, $ionicScrollDelegate, $ionicLoading,$rootScope,$ionicActionSheet,$ionicPopup, $timeout,$http) {
       
        $scope.showForm = true;
        $scope.pay = {};

        if($rootScope.text == 'Electric Bill'){
            $scope.balance = '196 KWH';
        };
        if($rootScope.text == 'Water Bill'){
            $scope.balance = '1000 units';
        };
        if($rootScope.text == 'Service Charge'){
            $scope.showme = true;
        } else{};

    $scope.triggerActionSheet = function() {

      $scope.showForm = true;

      var showActionSheet = $ionicActionSheet.show({
         buttons: [
            { text: '<i class="icon ion-card balanced"></i>Pay with Quickteller' },
            { text: '<i class="icon ion-cash calm"></i>Pay with App' }
         ],
      
         destructiveText: '<i class="icon ion-android-cancel assertive"></i>Cancel',
         titleText: '<h4>Make Payment</h4>',
      
         cancel: function() {
            return true
         },
      
         buttonClicked: function(index) {
            if(index === 0) {
              $scope.showForm = true;
               window.open('https://www.quickteller.com/ekedppostpaid', '_system', 'location=yes');
               return true;

            }
        
            if(index === 1) {
              $scope.showForm = false;
              return true;               
            }
         },
      
         destructiveButtonClicked: function() {
            return true;
            // add delete code..
         }
      });

      $timeout(function(){
        showActionSheet();
      }, 5000);
      
   };

   $scope.send = function(){

    $scope.api_token = localStorage.getItem('estate_api_token');
    if ($scope.pay.acc == null){
      $ionicPopup.alert
          ({
             template: 'Enter Account number'
          });


    } else if ($scope.pay.amount == null) {

       $ionicPopup.alert
          ({
             template: 'Enter Amount'
          });
    } else {

        $ionicLoading.show
             ({
                template: '<ion-spinner icon="spiral"></ion-spinner>',
                animation: 'fade-in'
                // duration:5000
              });
        

       var payment = JSON.stringify({"api_token": $scope.api_token, 
                                      "amount": $scope.pay.amount, 
                                      "title":$rootScope.text,
                                       });
       var link = "http://e-estate.herokuapp.com/api/payments";

       var headers= 
          {
            Content_Type: "application/json",
            Accept: 'application/json',
          };

       $http.post(link, payment, headers)
      .success(function(data,status,headers,config)
          {
            console.log(data);
           $ionicLoading.hide();
            $ionicPopup.alert
            ({
              title: 'Success!',
              template: 'Payment is being processed! <p> Confirmation email would be received shortly</p>'
            });
            $scope.pay.amount = '';
            $scope.pay.acc = '';
            $scope.showForm = true;

          })

       .error(function(data,status,headers,config)
       {
        $ionicLoading.hide();
        $ionicPopup.alert
          ({
             title: 'Network Error',
             template: 'Please try later'
          });
        $scope.showForm = false;


       });

    };

   };
    

})
    .controller('HomeCtrl', function($scope,$ionicLoading,$ionicPopup,$timeout,$http) {
        
        $scope.token =  localStorage.getItem('estate_api_token');
        $scope.id = localStorage.getItem('estate_id')

       $scope.showPopup = function() {
        $scope.data = {};

          var myPopup = $ionicPopup.show({
            template: '<textarea  ng-model="data.input">',
            title: 'Other Emergency',
            subTitle: 'Please describe emergency here',
            scope: $scope,
            buttons: [
              { text: 'Cancel', 
                type:"button-assertive",
                 onTap: function() {
                    myPopup.close();
                 } 
              },
              {
                text: '<b>Send</b>',
                type: 'button-positive',
                onTap: function(e) {

                  if (!$scope.data.input) {
                    console.log('her');
                    e.preventDefault();
                  
                  } else {

                    $ionicLoading.show({
                        template: 'Sending...'
                        // duration:5000
                    });

                    var emergency = JSON.stringify({"api_token": $scope.token,
                                           "user_id": $scope.id, 
                                           "type":'Other',
                                            "description":$scope.data.input});
                    var link = "https://e-estate.herokuapp.com/api/emergencies";
                    var headers= 
                    {
                    Content_Type: "application/json",
                    Accept: 'application/json',
                    };

                    $http.post(link, emergency, headers)
                    .success(function(data,status,headers,config)
                    {
                    console.log(data);
                    $ionicLoading.hide();

                    $ionicPopup.alert
                    ({
                    title: '<a class="icon-left"> <i class="icon ion-alert-circled"> Notified </a></i>',
                    template: 'The Estate has been Notified, Help will arrive Shortly!!'
                    });

                    }) .catch(function errorCallback()
                        {
                          $ionicLoading.hide();
                          $ionicPopup.alert({
                          title: 'Network Error',
                          template: 'Please try again..!'
                          });
                             $scope.signin.Passcode = null;
                             $scope.showLoader = true;
                        });
                    myPopup.close();
                    return $scope.data.input;
                  }
                }
              }
            ]
          });

          myPopup.then(function(res) {
             myPopup.close();
          });


          $timeout(function() {
             myPopup.close(); //close the popup after 3 seconds for some reason
          }, 20000);
         };

         

        $scope.emergency = function(info){
        {
            $scope.info = info;

            $ionicLoading.show({
                template: '<ion-spinner icon="spiral"></ion-spinner>'
                // duration :5000
            });

          var emergency = JSON.stringify({"api_token": $scope.token,
                                           "user_id": $scope.id, 
                                           "type":$scope.info,
                                            "description":"Emergency alert"});

          var link = "https://e-estate.herokuapp.com/api/emergencies";
         
          var headers= 
            {
              Content_Type: "application/json",
              Accept: 'application/json',
            };

          $http.post(link, emergency, headers).success(function(data,status,headers,config)
            {
                console.log(data);
               $ionicLoading.hide();

                $ionicPopup.alert
                ({
                    title: '<a class="icon-left"> <i class="icon ion-alert-circled"> Notified </a></i>',
                    template: 'The Estate has been Notified, Help will arrive Shortly!!'
                });

      }) .catch(function errorCallback()
                {
                 $ionicLoading.hide();
                  $ionicPopup.alert({
                  title: 'Network Error',
                  template: 'Please try again..!'
                  });
                });

      };
};
})

    .controller('RecVisitor', function($scope, $ionicPopup, $http, $state,$rootScope,$timeout,$ionicHistory,$ionicLoading,$rootScope){
      $ionicLoading.show({
      template: '<ion-spinner icon="spiral"></ion-spinner>',
      // duration: 6000,
    });
  

  var api = localStorage.getItem('estate_api_token');
  var link = "https://e-estate.herokuapp.com/api/visitors/?api_token="+api;
       var headers= 
          {
            Content_Type: "application/json",
            Accept: 'application/json',
          };
       $http.get(link, headers,{ timeout: 5000})
      .success(function(data,status,headers){
        $ionicLoading.hide();
        $scope.data = data.data;
        console.log($scope.data.data);
        $scope.showLoader = true;

      for(var i = 0; i < $scope.data; i++){
      console.log($scope.data[i].id);
    // 
        }

  }) .error(function(data,status,headers,config)
       {
        $ionicLoading.hide();
        $ionicPopup.alert
          ({
             title: 'Network Error',
             template: 'Please try later'
          });

       })
    // });

$scope.go = function(id) {
  
  $rootScope.visitor_id = id;
  console.log($rootScope.id);
}

$scope.Logout = function(){
      $timeout(function () {
        $ionicHistory.clearCache();
        $ionicHistory.clearHistory();
        $ionicHistory.nextViewOptions({ disableBack: true, historyRoot: true });
        localStorage.removeItem('estate_name');
        localStorage.removeItem('estate_address');
        localStorage.removeItem('estate_role');
        localStorage.removeItem('estate_api_token');
        localStorage.removeItem('estate_id');

        $state.go('user-login');
        }, 30);

};

            $scope.vis = function(vis){
            $rootScope.vis = vis;
            console.log(vis);
        };
    })


    .controller('seenVis', function($scope, $ionicPopup, $http, $state,$rootScope,$timeout,$ionicHistory,$ionicLoading,$rootScope){

      $scope.goBack = function() {
            // console.log('cli')
            $ionicHistory.goBack();
 };

       $scope.show = false;
        $scope.hide = false;

       $ionicLoading.show({
      template: '<ion-spinner icon="spiral"></ion-spinner>',
      // duration: 5000
      });
      var api = localStorage.getItem('estate_api_token');
      $scope.id = localStorage.getItem('estate_id');
      if ($scope.id == null){

      } else{

      console.log($rootScope.visitor_id);
      var link = 'https://e-estate.herokuapp.com/api/visitors/'+$rootScope.visitor_id+'/showVisitors?api_token='+api;
      var headers= 
          {
            Content_Type: "application/json",
            Accept: 'application/json',
          };
      $http.get(link,headers,{ timeout: 5000})
      .success(function(data){
      $ionicLoading.hide();
      $scope.data=data.data;

       for(var i = 0; i < $scope.data; i++){
      console.log($scope.data[i].names);
      // 
      }

      console.log($scope.data);
      $scope.showLoader = true;

      }).error(function(data,status,headers,config)
       {
        $ionicLoading.hide();
        $ionicPopup.alert
          ({
             title: 'Network Error',
             template: 'Please try later'
          });
        $scope.showLoader = true;

       })
      };

        $scope.click = function(index) {
            // console.log('hey');
          $scope.show = true;
          $scope.hide = true;
      };

      $scope.clic = function() {
            // console.log('hey');
          $scope.showme = true;
          $scope.hideme = true;
      };
      $scope.clicked = function(index) {
            // console.log('hey');
          $scope.showdem = true;
          $scope.hidedem = true;
      };

        

 




    })



    .controller('HometwoCtrl', function($scope, $ionicScrollDelegate, $window, $location,$ionicHistory,$state,$http,$ionicLoading,$rootScope,$ionicPopup) {

        $scope.showButton = true;
        $scope.hideButton = true ;

        $ionicLoading.show
         ({
            template: '<ion-spinner icon="spiral"></ion-spinner>',
            animation: 'fade-in',
            // duration:5000

          });


        $scope.showDetails = "dontshow";
        // $scope.moredetails = "Read More";
        $scope.showmores = function(index) {
        $scope.hideButton = false;
        $scope.showButton = false;

        console.log(index);
        var newheight = $(".animationfaq" + index).height();
        console.log(newheight);
        $(".faqhead").height(10);
        $(".faqhead" + index).height(newheight + 100);
        $ionicScrollDelegate.resize();


    };

    $scope.hideme = function(index){
        console.log(index);
        $scope.hideButton = true;
        $scope.showButton = true;
        var newheight = $(".animationfaq" - index).height();
        console.log(newheight);
        $(".faqhead").height(10);
        $(".faqhead" + index).height(newheight - 100);
        $ionicScrollDelegate.resize();
      };


    

    var api = localStorage.getItem('estate_api_token');
    var link = "https://e-estate.herokuapp.com/api/messages/?api_token="+api;
    var headers= 
      {
        Content_Type: "application/json",
        Accept: 'application/json',
      };
     $http.get(link, headers)
    .success(function(data,status,headers){
      $ionicLoading.hide();
      $scope.data = data.data;
      $scope.showLoader = true;

    for(var i = 0; i < $scope.data; i++){     console.log($scope.data[i].id);
}    console.log($scope.data);

    }).catch(function errorCallback()
                  {
                   $ionicLoading.hide();
                    $ionicPopup.alert({
                    title: 'Network Error',
                    template: 'Please try again..!'
                    });
                       // $scope.signin.Passcode = null;
                       $scope.showLoader = true;


                  });
    })


.controller('UserloginCtrl', function($scope, $stateParams, $state,$http,$rootScope,$ionicLoading,$ionicHistory,$ionicPopup) {
    
    $scope.login = {}

    $scope.login = function(){

       

     var datatosend = JSON.stringify ({
      'unique_code': $scope.login.enter,
       });

    var link = "http://e-estate.herokuapp.com/api/login";
     $ionicLoading.show({
            template: '<ion-spinner icon="spiral"></ion-spinner>'
            // duration :5000
          });
       $http.post(link, datatosend)
      .then(function successCallback (res)
    {
        
      $scope.info = res.data.data;
      console.log($scope.info);
         localStorage.setItem('estate_name',$scope.info.name);
         localStorage.setItem('estate_address', $scope.info.address);
         localStorage.setItem('estate_api_token', $scope.info.api_token);
         localStorage.setItem('estate_role', $scope.info.role);
         localStorage.setItem('estate_id', $scope.info.id);

        $rootScope.api_token = localStorage.getItem('estate_api_token');
        $rootScope.id = localStorage.getItem('estate_id');
        $rootScope.name = localStorage.getItem('estate_name');
        $ionicLoading.hide();


        if($scope.info.role == 'resident'){
        $scope.showLoader = true;
        $state.go('app.home');
        $ionicHistory.nextViewOptions({ disableBack: true, historyRoot: true });
      
      } else {

        $state.go('recvis');
        $ionicHistory.nextViewOptions({ disableBack: true, historyRoot: true });

      };

  })
    .catch(function errorCallback()
    {
      $ionicLoading.hide();
      $ionicPopup.alert({
      title: 'Error',
      template: 'Please enter code and try again..!'
      });
     $scope.login.enter = null;

    });

};

})


  




.controller('FaqCtrl', function($scope, $stateParams, $ionicScrollDelegate) {

    //    ****** More Text Json Format data ******

    $scope.showDetails = "dontshow";
    $scope.moredetails = "Read More";
    $scope.showmores = function(index) {
        console.log(index);
        var newheight = $(".animationfaq" + index).height();
        console.log(newheight);
        $(".faqhead").height(0);
        $(".faqhead" + index).height(newheight + 10);
        $ionicScrollDelegate.resize();


    };

    //    ****** End ******



    //    ****** FAQ Json Format data ******

    $scope.faq = [{
        id: 0,
        qsn: "HOW DO I GET THE E-ESTATES MOBILE APP..?",
        ans: "E-ESTATES is a free to download android/iOS app for users that have their estate/community registered on the E-ESTATES  service"
    }, {
        id: 1,
        qsn: "HOW DO I REGISTER? primary and secondary users.",
        ans: "Registration: you receive an email/message containing your login password as a primary user while a secondary user can only be registered by the primary users on his own account/profile by clicking on the register user option"
    }, {
        id: 2,
        qsn: "HOW DO I PAY MY BILLS ON THE APP..?",
        ans: "The pay for bills option feature is to pay for, water, electric, service charge bills.. there is an option to pay via quickteller/flutterwave, where you'll be required to put in your estate ID  and other payment details"
    }, {
        id: 3,
        qsn: "HOW DO I FILE REPORTS AND COMPLAINTS ON THE APP",
        ans: "This feature allows you to select the criteria in which your issue/ complaints is based on and also report clearly in details"
    }];

    //    ****** End ******


})
.controller ('pay_billCtrl', function(){

})
    .controller('AboutCtrl', function($scope, $stateParams, $window, $ionicScrollDelegate,$rootScope) {


        //    ****** About Content Json Format data ******

        // $scope.abouthead = [{
        //     content: "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit..."

        // }];
        // $scope.content = [{
        //     detail: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris a massa sit amet justo pretium condimentum. Integer sed lectus sit amet leo dictum ullamcorper nec in tellus. Quisque vitae venenatis eros, vitae venenatis eros. Maecenas nec leo non tortor dignissim fermentum sed aliquet ligula."

        // }];
        // $scope.moretext = [{
        //     more: "Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam aliquet ultrices dignissim. Donec pretium et dui ut imperdiet. Aliquam et urna non neque tempor vehicula at quis justo. Ut eleifend odio justo, et finibus mi aliquet vitae. Etiam euismod dapibus arcu nec pellentesque. Suspendisse faucibus velit ornare, tincidunt massa in, ullamcorper lectus. Quisque semper venenatis nulla, at auctor libero pharetra ultrices. Duis ut enim egestas, varius lorem ac, sodales sapien."

        // }];

        $scope.get = function(text){
            $rootScope.text = text;
            console.log(text);
        };

        //    ****** End ******


        //    ****** More Text Json Format data ******

        $scope.showDetails = "dontshow";
        $scope.moredetails = "Read More";
        $scope.showmore = function(classname) {
            var newheight = $(".moretext." + classname).height();
            console.log(newheight);
            console.log("show more clicked");
            if ($scope.showDetails == "showmore") {
                $scope.showDetails = "dontshow";
                $(".addanimation").height(0);
                $scope.moredetails = "Read More";
                $ionicScrollDelegate.$getByHandle('mainScroll').resize();
                $ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom();
            } else {
                $scope.showDetails = "showmore";
                $(".addanimation").height(newheight);
                $scope.moredetails = "Hide";
                $ionicScrollDelegate.$getByHandle('mainScroll').resize();
                $ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom();
            }

        };

        //***** End ******

    })
    .controller('ContactCtrl', function($scope, $stateParams, $ionicPopup, $ionicHistory,$state,$ionicLoading,$http) {

        //        ***** tabchange ****
        $scope.comp = {};
        $scope.tab = 'form-set';
        $scope.classa = 'map-active';
        // $scope.classb = ;

        $scope.tabchange = function(tab, a) {

            $scope.tab = tab;
            if (a == 1) {
                $scope.classa = "map-active";
                $scope.classb = '';

            } else {
                $scope.classa = '';
                $scope.classb = "map-active";

            }
        };

        $scope.showSelectValue = function(mySelect) {
        $scope.selected = mySelect;
        console.log($scope.selected);
        };

        $scope.sendR = function(){

          var startTime = new Date().getTime();
        console.log(startTime);

           $scope.api_token = localStorage.getItem('estate_api_token');
           $scope.id = localStorage.getItem('estate_id');
           $scope.name = localStorage.getItem('estate_name');


        if (!$scope.selected){
         
          $ionicPopup.alert({
            template: 'Please select complaint category!'
          });
           $ionicLoading.hide();

        
        } else if ($scope.comp.send == null) {
        
             $ionicPopup.alert
          ({
             template: 'Please enter Complaint!'
          });
           $ionicLoading.hide();
            }

        else {
         $ionicLoading.show
             ({
                template: '<ion-spinner icon="spiral"></ion-spinner>',
                animation: 'fade-in'
                // duration: 5000
              });

       var complaint = JSON.stringify({"api_token": $scope.api_token, 
                                      "user_id": $scope.id, 
                                      "category":$scope.selected,
                                       "description":$scope.comp.send});
       var link = "https://e-estate.herokuapp.com/api/complaints";
       var headers= 
          {
            Content_Type: "application/json",
            Accept: 'application/json',
          };

       $http.post(link, complaint, headers)
      .success(function(data,status,headers,config)
          {
            console.log(data);
           $ionicLoading.hide();
            $ionicPopup.alert
            ({
              title: 'Sent!',
              template: 'Complaint sent to Management!'
            });
            var respTime = new Date().getTime() - startTime;
            if(respTime >= config.timeout){
            console.log(respTime );
          };
            // $scope.comp.send = '';
            // $scope.selected = '';
          })
       .error(function(data,status,headers,config)
       {
        $ionicLoading.hide();
        $ionicPopup.alert
          ({
             title: 'Network Error',
             template: 'Please try later'
          });
        $scope.showLoader = true;

       })
   }


            
        $scope.comp.send = '';

        }

        //    ****** End ******

    })


.controller('SettingCtrl', function($scope, $stateParams) {})
.controller('ProfileCtrl', function($scope, $stateParams) {})


.controller('GallerycategoryCtrl', function($scope,$rootScope,$ionicPopup,$ionicHistory,$state,$ionicPopup,$http,$ionicLoading) {

    $scope.request = {};

     if($rootScope.service == 'Cleaning'){
            $scope.option1 = 'House Cleaning';
            $scope.option2 = 'Dry Cleaning';
            $scope.option3 = 'Pest Control';

        } else
     if($rootScope.service == 'Gas'){
            $scope.option1 = '5kg';
            $scope.option2 = '20kg';
            $scope.option3 = '50kg';
        }
        else{

            $scope.option1 = 'Fixing';
            $scope.option2 = 'Replace Item';
            $scope.option3 = 'Enquiry'
        }

    $scope.showSelectValue = function(mySelect) {
    $scope.selected_list = mySelect;
    console.log(mySelect);
    };


    $scope.send = function(){


        $scope.api_token = localStorage.getItem('estate_api_token');
        $scope.id = localStorage.getItem('estate_id');

        if (!$scope.selected_list){
         
          $ionicPopup.alert({
            template: 'Please select request category!'
          });
           $ionicLoading.hide();

        
        } 
        else if ($scope.request.enter == null) {
        
             $ionicPopup.alert
          ({
             template: 'Please enter description!'
          });
           $ionicLoading.hide();
            }

        else
      {
         $ionicLoading.show
             ({
                template: '<ion-spinner icon="spiral"></ion-spinner>',
                animation: 'fade-in',
                // duration:5000
              });

       var request = JSON.stringify({"api_token": $scope.api_token, 
                                      "user_id": $scope.id, 
                                      "category":$rootScope.service,
                                       "description":$scope.request.enter});
       var link = "https://e-estate.herokuapp.com/api/services";
       var headers= 
          {
            Content_Type: "application/json",
            Accept: 'application/json',
          };

       $http.post(link, request, headers)
      .success(function(data,status,headers,config)
          {
            console.log(data);
           $ionicLoading.hide();
            $ionicPopup.alert
            ({
              title: 'Sent!',
              template: 'Request sent to Management! <p> Vendor would contact you Shortly </p>'
            });
            $scope.request.enter = '';
            $scope.selected = '';
          })
       .error(function(data,status,headers,config)
       {
        $ionicLoading.hide();
        $ionicPopup.alert
          ({
             title: 'Network Error',
             template: 'Please try later'
          });
           $ionicLoading.hide();
       })

   }
        $scope.request.enter = '';

  }

    
        
    
	

})

.controller('SingleCtrl', function($scope,$ionicPopup, $http, $filter,$rootScope,$ionicHistory,$ionicLoading){

    $scope.visitor= {};

        $scope.send = function(){
        $scope.api_token = localStorage.getItem('estate_api_token');
        $scope.id = localStorage.getItem('estate_id');

        if ($scope.visitor.single == null){
         
            $ionicPopup.alert({
            template: 'Please enter visitor name!'
          });
        
        $scope.showLoader = true;

        }else if (!$scope.visitor.date) {
        
             $ionicPopup.alert
          ({
             template: 'Please enter Date'
          });
      } else {

            $ionicLoading.show
             ({
                template: '<ion-spinner icon="spiral"></ion-spinner>',
                animation: 'fade-in'
                // duration:6000
             });
                var appDate = $filter('date')($scope.visitor.date, "dd/MMM/yyyy");

               var visitor = JSON.stringify({"api_token": $scope.api_token, 
                                              "user_id": $scope.id, 
                                              "names":$scope.visitor.single,
                                               "date":appDate});
               var link = "https://e-estate.herokuapp.com/api/visitors";
               var headers= 
          {
            Content_Type: "application/json",
            Accept: 'application/json',
          };

       $http.post(link, visitor, headers)
      .success(function(data,status,headers,config)
          {
            console.log(data);
           $ionicLoading.hide();
            $ionicPopup.alert
            ({
              template: 'Visitor Information Sent to the Gate!'
            });
            $scope.visitor.single = '';
            $scope.visitor.date = '';
          })
       .error(function(data,status,headers,config)
       {
        $ionicLoading.hide();
        $ionicPopup.alert
          ({
             title: 'Network Error',
             template: 'Please try later'
          });
        $scope.showLoader = true;

       })

            $scope.visitor.single = '';
            $scope.visitor.date = '';

        };
    };

})

.controller('MultipleCtrl', function($scope,$ionicPopup, $http, $filter,$rootScope,$ionicHistory,$ionicLoading) {

    $scope.todoList = [];
    $rootScope.visitorInput = {};
    $scope.visitor = {};
    $rootScope.products = [];
    $scope.showTabs = false;
    $scope.showLoader = true;
    $scope.showButton = false;
    $scope.showLoader = true;
    $scope.hideButton = true;

  

    if($scope.visitorInput.text == null)
    {
       $scope.showButton=false;
    }

    // if($scope.products = []){
    //       $scope.hideButton = true;
    //       }

    else {}    

  $scope.addItem = function () 
  {
      $scope.errortext = "";
      if ($scope.visitorInput.text == null)
      {
        $ionicPopup.alert
          ({
             template: 'Insert Visitor Name!'
          });
      }

        if (!$scope.visitorInput.text) {return;}
        if ($scope.products.indexOf($scope.visitorInput.text) == -1) 
        {
            $scope.products.push($scope.visitorInput.text);
            $scope.hideButton = false;
            console.log($scope.products);
            $scope.visitorInput.text = '';

           
    }else {
            $ionicPopup.alert
          ({
             template: 'Name is already in the List!'
          });
        };
  };
  
   $scope.goBack = function() {
      
       $ionicHistory.goBack();
  };

     $scope.sendList = function()
     {
      // console.log('hi');
       var Vdata = $rootScope.products.join(", ");
             
         var myPopup = $ionicPopup.show({
         template: '<input type = "date" ng-model ="visitorInput.date">',
         title: 'Expected Arrival Date',
         scope: $scope,
      
         // buttons: [
            buttons: [
              { text: 'Cancel', type:"button-assertive" },
              {
               text: '<b>Send</b>',
               type: 'button-positive',
               onTap: function(e) {
            
                  if (!$scope.visitorInput.date) {
                     //don't allow the user to send unless he enters model...
                     e.preventDefault();
                  } else {
                     return $scope.visitorInput.date;
                  }
               }
            }
         ]
      });

      myPopup.then(function(res) {
       $ionicLoading.show
             ({
                template: '<ion-spinner icon="spiral"></ion-spinner>',
                animation: 'fade-in'
                // duration: 6000
              });
        $scope.api_token = localStorage.getItem('estate_api_token');
        $scope.id = localStorage.getItem('estate_id');

        var appDate = $filter('date')($scope.visitorInput.date, "dd/MMM/yyyy")
        var visitor = JSON.stringify({"api_token": $scope.api_token, 
                                      "user_id": $scope.id, 
                                      "names":Vdata,
                                      "single": 0,
                                       "date":appDate});
          var link = "https://e-estate.herokuapp.com/api/visitors";
          var headers= 
            {
              Content_Type: "application/json",
              Accept: 'application/json',
            };

          $http.post(link, visitor, headers)
         
         .success(function(data,status,headers,config)
            {  
               $ionicLoading.hide();
               $scope.hideButton= true;
               $scope.products = '';
               $ionicPopup.alert
              ({
                template: 'Visitor List sent to the Gate!'
              });

      }) .error(function(data,status,headers,config)
           {
              $ionicLoading.hide();
              $ionicPopup.alert
              ({
                 title: 'Network Error',
                 template: 'Please try later'
              });
            $scope.showLoader = true;

           })
      
         
        });
    }; 

    $scope.deleteList = function(x)
    {
      var confirmPopup = $ionicPopup.confirm({
       title: '<b> <font color=red>Delete All</font></b>',
       template: 'Are you sure you want to Delete List?',
        buttons: [
              { text: 'Cancel', type:"button-assertive" },
              {
               text: '<b>Yes</b>',
               type: 'button-positive',
               onTap: function(res) {
            
                  if (res) {
                     $scope.products.splice (x);
                     $scope.hideButton = true;

                  } else {
                    console.log('hey');
                  }
               }
            }
        ]
     });

    }

    $scope.removeItem = function(x) 
    {
        $scope.errortext = "";
        $scope.products.splice(x, 1);
        console.log($scope.products);
        if($scope.products >= 0){
          $scope.hideButton = true;
        };
    };

})


// .controller('MultipleCtrl', function($scope,ionicPopup){

// })


.controller('GalleryCtrl', function($scope, $stateParams, MyServices,$rootScope) {

        $scope.get = function(service){
            $rootScope.service = service;
            console.log(service);
        };

    })


.controller('UsersignupCtrl', function($scope,$http,$state,$ionicPopup, $ionicActionSheet,$timeout,$ionicHistory,$rootScope,$ionicLoading) { 
      
      $scope.user = {};
    $scope.register=function(){

      if ($scope.user.name == null){
         
          $ionicPopup.alert({
            template: 'Please enter Users name!'
          });
        
        }else if (!$scope.user.email) {
             $ionicPopup.alert
            ({
               template: 'Please enter E-mail'
            });
           }
        else if (!$scope.user.phone) {
             $ionicPopup.alert
            ({
               template: 'Please enter Phone'
            });
           } else {
      
      $scope.api_token = localStorage.getItem('estate_api_token');
      $ionicLoading.show
             ({
                template: '<ion-spinner icon="spiral"></ion-spinner>',
                animation: 'fade-in'
                // duration:5000
              });
        

       var user = JSON.stringify({"api_token": $scope.api_token,
                                     "name": $scope.user.name, 
                                      "email": $scope.user.email, 
                                      "phone":$scope.user.phone,
                                       });
       var link = "http://e-estate.herokuapp.com/api/residents/sub";

       var headers= 
          {
            Content_Type: "application/json",
            Accept: 'application/json',
          };

       $http.post(link, user, headers)
      .success(function(data,status,headers,config)
          {
            console.log(data);
           $ionicLoading.hide();
            $ionicPopup.alert
            ({
              title: 'Registered Sucessfully!',
              template: '<p>New User would receive an email soon.. </p>'
            });
            $scope.user.name = '';
            $scope.user.email = '';
            $scope.user.phone = '';
            $scope.showForm = true;

          })
       .error(function(data,status,headers,config)
       {
        $ionicLoading.hide();
        $ionicPopup.alert
          ({
             title: 'Network Error',
             template: 'Please try later'
          });
        $scope.showLoader = true;
        $scope.showForm = false;


       })
     };
    };
});