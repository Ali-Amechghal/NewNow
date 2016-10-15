angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $state ,$q ,$http,$ionicLoading,$cordovaVibration,$cordovaSQLite,$ionicScrollDelegate) {
  console.log('MainCtrl');
   start = 0;
    searchv = 'world';
    id = 0;
     $scope.save = function(o) {

        //  $localStorage.o = o;
        var query = "INSERT INTO data (title , date , publis ,tb , url , b ) VALUES (? , ?  , ?  ,?  , ?  , ? )"
        $cordovaSQLite.execute(db ,query ,[o.titleNoFormatting , o.publishedDate , o.publisher , o.image.tbUrl , o.signedRedirectUrl ,1]).then(function(res){console.log('Insert ID : ' + res.insertId);},function(err){console.log('err : '  +err);});

                }

    var startNxt = function(){
        start += 5;
        console.log('call  + ' + start);
    }
     var startPrv = function(){
        start -= 5;
        console.log('call - ' + start);
    }
     var startInit = function(){
        start = 0;
        console.log('call init ' + start);
    }
     var searchInit = function(s){
        searchv = s;

    }
      $scope.prvs = function(){
          if(start ==0){

         return false;
          }else{
              return true;
          }

    }
  $scope.toIntro = function(){
    $state.go('intro');
  }
  $scope.init = function(){
   startInit();
      $scope.getImages('world').then(function(data){
          $scope.images = data.responseData.results;
          console.log(data);
          console.log( $scope.images);

      },function(status){});
  }
  $scope.search = function(k){
      startInit();
      searchInit(k);
         $scope.getImages(k).then(function(data){
          $scope.images = data.responseData.results;

          console.log(data);
          console.log( $scope.images);

      },function(status){});
  }
  $scope.nxt=function(){
        $cordovaVibration.vibrate(100);
      startNxt();

        $scope.getImages(searchv).then(function(data){
          $scope.images = data.responseData.results;
$ionicScrollDelegate.scrollTop();



      },function(status){});
  }
  $scope.prv=function(){


    $cordovaVibration.vibrate(100);
  startPrv();

    $scope.getImages(searchv).then(function(data){
      $scope.images = data.responseData.results;

$ionicScrollDelegate.scrollTop();


  },function(status){});

  }


  $scope.getImages = function(k){

      var defer = $q.defer();
      var url = 'https://ajax.googleapis.com/ajax/services/search/news?v=1.0&q='+k+'&rsz=5&start='+start+'&callback=JSON_CALLBACK';
    $ionicLoading.show({template : "Loading..."});
      $http.jsonp(url).success(function(data){ console.log(data);
          $ionicLoading.hide();
          defer.resolve(data);
      }).error(function(status,err){
          defer.reject(status);
      })
      return defer.promise;
  }
  if($scope.k == undefined) {$scope.init()}
})

.controller('ChatsCtrl', function($scope,$cordovaContacts, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
// getAllContacts = function() {
//     $cordovaContacts.find().then(function(allContacts) {
//       $scope.contacts = allContacts;
//
//     })
//   };
// getAllContacts();
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {




  $scope.chat = Chats.get($stateParams.chatId);
})


.controller('AccountCtrl', function($scope,$cordovaSQLite,$location) {
  $scope.$on('$locationChangeStart', function(event) {
          $scope.load();
      });
 $scope.load = function() {
                    //
                    // $scope.data = $localStorage.o;
                    // console.log('yy' + $localStorage.o );

                  var query = "SELECT * FROM data WHERE 1=1 order by id desc"  ;
                  $cordovaSQLite.execute(db , query).then(function(res){
                    if(res.rows.length > 0){
                        console.log('Select  : ' + res.rows.item(0).title);
                        console.log('Select  ROWS ====  : ' + res.rows);
                        console.log( res.rows);
                        d = [];
     for(var i=0; i<res.rows.length; i++){
         d.push(res.rows.item(i));}

                        $scope.datast = d;
                    }else{
                        console.log('Select  : NO DATA !');
                    }

                  },function(err){console.log('err :' + err);});
                }
                $scope.delete = function(id){

                  var query = "DELETE FROM data where id = ?";
                  $cordovaSQLite.execute(db,query,[id]).then(function(res){$scope.load();},function(err){ console.log(err);alert('ERROR : ' + err.message);})
                }
                $scope.load();
                $scope.shouldShowDelete = false;

  $scope.settings = {
    enableFriends: false
  };

});
