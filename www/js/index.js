/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */ 

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        
    },onDeviceReady: function() {
        var pushNotification = window.plugins.pushNotification;
        pushNotification.register(app.successHandler, app.errorHandler,{"senderID":"391779146922","ecb":"app.onNotificationGCM"});
    },successHandler: function(result) {
        console.log('registration Callback Success! Result = '+result);
    },errorHandler:function(error) {
        console.log("registration error");
        console.log(error);
    },onNotificationGCM: function(e) {
        switch( e.event ) {
            case 'registered':
                if ( e.regid.length > 0 ) {
                    var url = 'http://autowikipedia.es/phonegap/insert_registerid/' + e.regid + '/ganzua';
                    insertar_id(url);
                    console.log("Regid " + e.regid);
                    $("#eventos").text("el e.regid es " + e.regid);
                }
            break;
            case 'message':
              // this is the actual push notification. its format depends on the data model from the push server
              alert('message = '+e.message+' msgcnt = '+e.msgcnt);
            break;
            case 'error':
              alert('GCM error = '+e.msg);
            break;
            default:
              alert('An unknown GCM event has occurred');
              break;
        }
    }
};//devideready

function insertar_id(url){
    console.log("estoy adentro de insertar_id");
    $.post(url, function(data) {
        if (data == "ok"){
            alert("todo perfecto;");
        }
    });
}
