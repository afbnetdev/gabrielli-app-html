
//Causa problemi se inserito in util

//Services

function getMaximoTktList(stringFilter){
    var err;
    var myList;
    $$.ajax({
        headers: {
            'Access-Control-Allow-Origin': '*',
            "jSessionID": window.sessionStorage.jsessionid,
            "cache-control": "no-cache",
            "stringFilter" : stringFilter
        },
        // data: filters,
        async: false, //needed if you want to populate variable directly without an additional callback
        // url: 'http://portal.gabriellispa.it/AFBNetWS/resourcesMaximo/manageTicket/elencoTicketsUtente/' + window.sessionStorage.username,
        url: URL_ENDPOINT+'/AFBNetWS/resourcesMaximo/manageTicket/elencoTicketsUtente/',
        method: 'GET',
        dataType: 'json', //compulsory to receive values as an object
        processData: true, //ignore parameters if sets to false
        //contentType: 'application/x-www-form-urlencoded',
        crossDomain: true,
            error: function (data, status, xhr) {
                //alert(JSON.stringify(data));
                myApp.alert('Errore caricamento ticket', "Attenzione");
                err = 'err_00'
            },
            success: function (data, status, xhr) {
                myList = data;
            },
        statusCode: {
            500: function(xhr){
                // myApp.alert('Servizio Maximo non disponibile');

            },
            401: function (xhr) {
                myApp.alert('App non autorizzata ad ottenere i dati', "Attenzione");
            }
        }
    });
    return myList;
}


function getUserAnag(){
    var ctrl = false;
    if(window.sessionStorage.jsessionid === ''){
       getLogout();
    }
    else{
//        myApp.alert(window.sessionStorage.jsessionid);
        $$.ajax({
            headers: {
    //            'Authorization': 'Bearer 102-token',
                'Access-Control-Allow-Origin': '*',
                "jSessionID": window.sessionStorage.jsessionid,
                "cache-control": "no-cache"
            },
            url:  URL_ENDPOINT+'/AFBNetWS/resourcesMaximo/userProfile/anagUtente/' + window.sessionStorage.username,
            method: 'GET',
            crossDomain: true,
            async: false,
            success: function (data, status, xhr) {
                data = JSON.parse(data);
                window.sessionStorage.setItem("codcliamm", data.anag.member[0].codcliamm);
                window.sessionStorage.setItem("codforamm", data.anag.member[0].codforamm);
                window.sessionStorage.setItem("codicefiscale", data.anag.member[0].codicefiscale);
                window.sessionStorage.setItem("personid", data.anag.member[0].personid);
            },
            statusCode: {
                401: function (xhr) {
                    myApp.alert('Errore chiamata servizio di profilo utente','User profile Error');
                }
            },
            error: function (data, status, xhr) {
                myApp.alert('Servizio di login non disponibile.', "User profile error");
            }
        });
    }
    return ctrl;
}
function getUserInfo(){
        if(window.sessionStorage.jsessionid === ''){
            myApp.hidePreloader();
            getLogout();
            
        }else{
             $$.ajax({
                headers: {
                    'Authorization': 'Bearer 102-token',
                    'Access-Control-Allow-Origin': '*',
                    'Content-type': 'application/x-www-form-urlencoded',
                    'jSessionID': window.sessionStorage.jsessionid,
                },
                async: false, //needed if you want to populate variable directly without an additional callback
                url :URL_ENDPOINT+'/AFBNetWS/resourcesMaximo/userProfile/infoUtente',
                method: 'GET',
                dataType: 'json', //compulsory to receive values as an object
                processData: true, //ignore parameters if sets to false
                //contentType: 'application/x-www-form-urlencoded',
                crossDomain: true,
                    error: function (data, status, xhr) {

                        //alert(JSON.stringify(data));
                        myApp.alert('Errore reperimento Email utente', "Attenzione");
                        err = 'err_00';
                        myApp.hidePreloader();
                    },
                    success: function (data, status, xhr) {
                        window.sessionStorage.setItem("userEmail", data.info.email);
                         
                    },

                statusCode: {
                    401: function (xhr) {
                        myApp.hidePreloader();
                        myApp.alert('App non autorizzata ad ottenere i dati', 'docListError');
                    }
                }
            });
            
        }
}
function validateUser(uuid,upwd){
    var chkLogin = false;
    
    if(!uuid || !upwd){
        myApp.alert("Inserire username e password","Login errato");
        userAndPwdCheck = false;
        return;
    }

    $$.ajax({
        headers: {
//            'Authorization': 'Bearer 102-token',
            'Access-Control-Allow-Origin': '*',
            "username": uuid,
            "password": upwd,
            "cache-control": "no-cache"
        },
        url:  URL_ENDPOINT+'/AFBNetWS/resourcesMaximo/userProfile/login',
        method: 'GET',
        crossDomain: true,
        async: false,
        success: function (data, status, xhr) {
            myApp.hidePreloader();
            data = JSON.parse(data);
//            myApp.alert(data.statusCode,"Status code");
//            myApp.alert(data.jSessionID,"JSESSIONID");
            if( data.statusCode == 200 && data.jSessionID != '' ){
                window.sessionStorage.setItem("jsessionid", data.jSessionID);
                window.sessionStorage.setItem("username", uuid);
                chkLogin = true;
            }
        },
        statusCode: {
            401: function (xhr) {
                myApp.hidePreloader();
                myApp.alert('Errore chiamata servizio di login','Login Error');
            }
        },
        error: function (data, status, xhr) {
//            var output;
//            for (var key in data) {
//                if (data.hasOwnProperty(key)) {
//                    output += key + " -> " + data[key];
//                }
//            }
            myApp.hidePreloader();
            myApp.alert('Servizio di login non disponibile.', "Login error");
        }
    });
    return chkLogin;
}

function getUserProfile(){
     if(window.sessionStorage.jsessionid === ''){
        myApp.hidePreloader();
        getLogout();
   }else{
    $$.ajax({
        headers: {
//            'Authorization': 'Bearer 102-token',
            'Access-Control-Allow-Origin': '*',
            'jSessionID': window.sessionStorage.jsessionid
        },
        url:  URL_ENDPOINT+'/AFBNetWS/resourcesMaximo/userProfile/profilazioneUtente/'+window.sessionStorage.username,
        method: 'GET',
        crossDomain: true,
        async: false,
        success: function (data, status, xhr) {
            var data = JSON.parse(data);
            var userProfile = setUserProfile(data);
        },
        statusCode: {
            401: function (xhr) {
                myApp.alert('Errore chiamata servizio di profilazione','Profile Error');
            }
        },
        error: function (data, status, xhr) {
//            var output;
//            for (var key in data) {
//                if (data.hasOwnProperty(key)) {
//                    output += key + " -> " + data[key];
//                }
//            }
            myApp.alert('Servizio di login non disponibile.', "Login error");
        }
    });
   }
}

// funzione reperimento documenti
function getDocumentList(docAmountFrom,docAmountTo,dateFrom,dateTo,docContains,docType){
    
        if(window.sessionStorage.jsessionid === ''){
            myApp.hidePreloader();
            getLogout();
        }else{
            if(docType){
                var docTypeToFilter = 'op=contain,value='+docType+'';
            }else{
                var docTypeToFilter = '';
            }
            //sostituire il codice fiscale con +window.sessionStorage.codicefiscale
            $$.ajax({
                headers: {
                    'Authorization': 'Bearer 102-token',
                    'Access-Control-Allow-Origin': '*',
                    'Content-type': 'application/x-www-form-urlencoded',
                    'jSessionID': window.sessionStorage.jsessionid,
                    'DocFilterDataDocumento':'op=between,from='+dateFrom+',to='+dateTo,
                    'DocFilterTipoDocumento': docTypeToFilter,
                    // 'DocFilterCodiceFiscale':'op=equal,value=01654010345',
                    'DocFilterCodiceFiscale':'op=equal,value='+window.sessionStorage.codicefiscale,
                    'DocFilterImporto':'op=between,from='+docAmountFrom+',to='+docAmountTo,
                    'DocFilterNumeroDocumento':'op=contain,value='+docContains
        //            'dataType':'json',
                },
        //        data: '{ "filters":[{ "key":"RDTipoDocumento", "op":"contain", "value":"DDT" },{ "key":"RDDataDocumento", "op":"between", "from":"", "to":"" },{ "key":"RDNumeroDocumento", "op":"contain", "value":"" }]}',
        //        data: JSON.stringify(obj),
                async: false, //needed if you want to populate variable directly without an additional callback
                url : URL_ENDPOINT+'/AFBNetWS/resourcesDocs/manageDocs/getDocumenti/',
                method: 'GET',
                dataType: 'json', //compulsory to receive values as an object
                processData: true, //ignore parameters if sets to false
                //contentType: 'application/x-www-form-urlencoded',
                crossDomain: true,
                    error: function (data, status, xhr) {
                        myApp.hidePreloader();
                        //alert(JSON.stringify(data));
                        myApp.alert('Errore reperimento dati', "Attenzione");
                        err = 'err_00'
                    },
                    success: function (data, status, xhr) {
                            myApp.hidePreloader();
                            // alert(window.sessionStorage.jsessionid);
                            if(data.status && data.status=='401'){
                                getLogout();
                            }
                            else{
                                docTableData = data.documents;
                            }
                    },

                statusCode: {
                    401: function (xhr) {
                        myApp.alert('App non autorizzata ad ottenere i dati', 'docListError');
                         getLogout();
                    }
                  
                }
            });
                return docTableData;
            }
}
function sendDocument(keyDoc_RF, linkUrlDocumento_SP, title){
     if(window.sessionStorage.jsessionid === ''){
            myApp.hidePreloader();
            getLogout();
        }else{
                $$.ajax({
                      headers: {
                          'Authorization': 'Bearer 102-token',
                          'Access-Control-Allow-Origin': '*',
                          'Content-type': 'application/x-www-form-urlencoded',
                          'jSessionID': window.sessionStorage.jsessionid,
                          'EMail' : window.sessionStorage.userEmail,
                          'LinkUrlDocumento_SP': linkUrlDocumento_SP,
                          'KeyDoc_RF': keyDoc_RF,
                          'Subject': title
                      },
                      async: false, //needed if you want to populate variable directly without an additional callback
                      url :URL_ENDPOINT+'/AFBNetWS/resourcesDocs/manageDocs/sendDocument',
                      method: 'GET',
                      dataType: 'json', //compulsory to receive values as an object
                      processData: true, //ignore parameters if sets to false
                      //contentType: 'application/x-www-form-urlencoded',
                      crossDomain: true,
                          error: function (data, status, xhr) {
                              myApp.hidePreloader();
                              //alert(JSON.stringify(data));
                              myApp.alert("Errore nell'invio della mail", "Attenzione");
                              err = 'err_00'
                          },
                          success: function (data, status, xhr) {
                                  myApp.hidePreloader();
                                  myApp.alert('Documento inviato con successo alla email: '+window.sessionStorage.userEmail, "Documento");
                          },

                      statusCode: {
                          401: function (xhr) {
                              myApp.hidePreloader();
                              myApp.alert('App non autorizzata ad ottenere i dati', 'docListError');
                          }
                      }
                  });
              }
};
function newTicket(){
    if(window.sessionStorage.jsessionid === ''){
        myApp.hidePreloader();
        getLogout();
   }
   else{
       //get ticket data
       var dataoutput;
       var error = false;
       var suffix = '__' + Math.round(new Date().getTime()/1000);
       var tkttitle = $$("#title").val() + suffix;
       var tktnewtitle = $$("#title").val();
       var tktdetails = $$('#dettagli').val();
       var tktdata = {};

       if(!tktnewtitle){
           myApp.hidePreloader();
           myApp.alert('Il titolo è obbligatorio', "Attenzione");
           return false;
       }
       if(!tktdetails){
           myApp.hidePreloader();
           myApp.alert('La descrizione è obbligatoria', "Attenzione");
           return false;
       }

       tktdata.description = tkttitle;
       tktdata.description_longdescription = tktdetails;
       tktdata.reportedby = window.sessionStorage.personid;
       tktdata.typestart = "APP";
       //call for new ticket service
       $$.ajax({
           headers:{
               'Authorization': 'Bearer 102-token',
               'Access-Control-Allow-Origin': '*',
            //    'Content-type': 'application/x-www-form-urlencoded',
               'jSessionID': window.sessionStorage.jsessionid
            },
            url :URL_ENDPOINT+'/AFBNetWS/resourcesMaximo/manageTicket/apriTicket',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(tktdata),
            async: false,
            success: function(data){
                dataoutput = data;
                myApp.hidePreloader();
            },
            error: function(data, status, xhr){
                myApp.hidePreloader();
                error = true;
                console.log('Request status: ' + status);
            },
            statusCode:{
                415: function(xhr) {
                    myApp.hidePreloader();
                    myApp.alert('Servizio non disponibile. Error status: 415', "Attenzione");
                    return false;
                }
            }
        });
        if(error){
            myApp.hidePreloader();
            myApp.alert('Impossibile aprire un tkt', "Attenzione");
            return false;
        }
        //get inserted ticket
        var stringFilter = 'oslc.select=*&oslc.where=description="'+tkttitle+'"';
        var ticketObj = getMaximoTktList(stringFilter);
        // console.log(ticketObj.member[0]);
        var doclink = ticketObj.member[0].doclinks.href;
        var ticketid = ticketObj.member[0].ticketid;
        var hrefTkt = ticketObj.member[0].href;
        console.log('doclink: ' + doclink + ' ---- tktid: ' + ticketid);
        // return false;
        var fileName = '';
        var fileType = '';
        var docMeta = '';
        var docDescr = '';
        //send file to the ticket inserted
        if($$("#file-to-upload")[0].files.length>0){
            var formData1 = new FormData();
            formData1.append("fileid",$$("#file-to-upload")[0].files[0]);
            fileName = $$("#file-to-upload")[0].files[0].name;
            fileType = $$("#file-to-upload")[0].files[0].type;
            if(fileType=='image/png' || fileType=='image/jpeg'){
                docMeta = 'Images';
            }
            else{
                docMeta = 'Attachments';
            }
            docDescr = $$('#file-label').html();
            callToMaximoFile(doclink, fileType, docMeta, docDescr, fileName, formData1)
        }
        if( $$('#small-image').attr('src')!='' ){
            var img = $$('#small-image').attr('src');
            var imgdatafile = dataURItoBlob(img);
            var formData2 = new FormData();
            formData2.append("fileid", imgdatafile);
            fileName = 'myPhoto'+suffix+'.jpg';
            fileType = 'image/jpeg';
            docMeta = 'Images';
            docDescr = fileName;
            callToMaximoFile(doclink, fileType, docMeta, docDescr, fileName, formData2)
        }
        modifyTktTitle(tktnewtitle,hrefTkt);
        myApp.hidePreloader();
        myApp.alert('Ticket creato correttamente', "Ticket");
        mainView.router.reloadPage("manage_ticket.html");

        //reset ticket title
        
    return false;
   }
}
function callToMaximoFile(doclink, fileType, docMeta, docDescr, fileName, formData){
    $$.ajax({
        headers: {
           'Authorization': 'Bearer 102-token',
           'Access-Control-Allow-Origin': '*',
        // 'Content-type': 'multipart/form-data; boundary=----maximoCustomBoundary;',
            'doclinks': doclink,
            'contentType': fileType,
            'documentMeta': docMeta,
            'documentDescription': docDescr,
            'fileB64': "base64",
            'nomeFile': fileName,
            'jSessionID': window.sessionStorage.jsessionid,
        },
        url :URL_ENDPOINT+'/AFBNetWS/resourcesMaximo/manageTicket/allegaFile',
        // url: 'http://192.168.3.9/v2/ttm/postfile',
        method: 'POST',
        data: formData,
        async: false,
        success: function (data) {
            console.log('Upload file andato a buon fine');
        },
        error: function (data, status, xhr) {
            console.log('Upload file fallito!' + JSON.stringify(data) + ' status: ' + status);
            myApp.alert('Upload file fallito! STATUS: ' + status, "Attenzione");
        },
        cache: false,
        contentType: false,
        processData: false
    });
    return false;
}
function modifyTktTitle(tktnewtitle,hrefTkt){
    var tktdata = {};
    var error = false;
    tktdata.description = tktnewtitle;
    $$.ajax({
        headers:{
            'Authorization': 'Bearer 102-token',
            'Access-Control-Allow-Origin': '*',
            'jSessionID': window.sessionStorage.jsessionid,
            'hrefTicket': hrefTkt
         },
         url :URL_ENDPOINT+'/AFBNetWS/resourcesMaximo/manageTicket/modificaTicket',
         method: 'POST',
         contentType: 'application/json',
         data: JSON.stringify(tktdata),
         async: false,
         success: function(data){
             console.log("OK TITOLO MODIFICATO");
         },
         error: function(data, status, xhr){
             error = true;
             console.log('Request status: ' + status);
         },
         statusCode:{
             415: function(xhr) {
                 myApp.alert('Servizio non disponibile. Error status: 415', "Attenzione");
                 return false;
             }
         }
     });
     if(error){
         myApp.alert('Impossibile modificare tkt', "Attenzione");
         return false;
     }
     return false;
}
function sendEval(valutazioneTempistica, valutazioneSoluzione, valutazioneCortesia, notaValutazione, hrefTicket){
     if(window.sessionStorage.jsessionid === ''){
            myApp.hidePreloader();
            getLogout();
        }else{
            var obj = new Object();
            obj.livello_tempistica = valutazioneTempistica;
            obj.livello_soluzione  = valutazioneSoluzione;
            obj.livello_cordialita = valutazioneCortesia;
            obj.noteval = notaValutazione;
            var evaluation= JSON.stringify(obj);
            
                $$.ajax({
                      headers: {
                          'Authorization': 'Bearer 102-token',
                          'Access-Control-Allow-Origin': '*',
                          'jSessionID': window.sessionStorage.jsessionid,
                          'hrefTicket': hrefTicket
                      },
                      data: evaluation,
                      async: false, //needed if you want to populate variable directly without an additional callback
                      url :URL_ENDPOINT+'/AFBNetWS/resourcesMaximo/manageTicket/valutaTicket',
                      method: 'POST',
                      //dataType: 'json', remove if a post request
                      processData: true, //ignore parameters if sets to false
                      contentType: 'application/json',
                      crossDomain: true,
                          error: function (data, status, xhr) {
                              myApp.hidePreloader();
                              //alert(JSON.stringify(data));
                              myApp.alert("Errore nell'invio della valutazione", "Attenzione");
                              err = 'err_00'
                          },
                          success: function (data, status, xhr) {
                                  myApp.hidePreloader();
                                  myApp.alert('Valutazione inviata con successo', "Valutazione");
                                  blockAfterEval();
                          },

                      statusCode: {
                          401: function (xhr) {
                              myApp.hidePreloader();
                              myApp.alert('App non autorizzata ad inviare i dati', "Attenzione");
                          }
                      }
                  });
              }
};
function getLogout(){
    myApp.alert('Clicca per effettuare il login', 'Sessione Scaduta', function () {
        window.sessionStorage.clear();
        myApp.loginScreen(".login-screen", false);
    });
}
function sendIspezioneHeader(commenti,controllore,dataIspezione,presenti,tipoEvento,puntoVendita){
     var obj = new Object();
     obj.commenti = commenti;
     obj.controllore = controllore;
     obj.dataIspezione= dataIspezione;
     obj.presenti=presenti;
     //sempre in status bozza al salvataggio dell'header
     obj.status="B";
     obj.tipoEvento= {idTipoEvento: tipoEvento};
     obj.puntoVendita = { idPdv: puntoVendita};
     var evaluation= JSON.stringify(obj);
    $$.ajax({
        headers: {
           'Authorization': 'Bearer 102-token',
           'Access-Control-Allow-Origin': '*'
        },
        url :TEST_URL+'/GabrielliAppV2WS/rest/ispezione/create',
        method: 'POST',
        data: evaluation,
        async: false,
        contentType: 'application/json',
        crossDomain: true,
        
        success: function (data) {
            var ispezioneCreata = JSON.parse(data);
            populateInfoIspezione(ispezioneCreata);
            getControlliFromIdEvento(ispezioneCreata.tipoEvento.idTipoEvento, "B");
        },
        error: function (data, status, xhr) {
            myApp.hidePreloader();
            myApp.alert("Errore nel salvataggio dell'ispezione", "Errore");
        }
    });
}
function submitIspezioneDettaglio(status,jsonObj, commenti,controllore,dataIspezione,presenti,tipoEvento,puntoVendita){
    var obj = new Object();
    obj.idIspezione= $$(".idIspezione").text();
    obj.commenti = commenti;
    obj.controllore = controllore;
    obj.dataIspezione= dataIspezione;
    obj.presenti=presenti;
     //sempre in status bozza al salvataggio dell'header
    obj.status = status;
    obj.dettaglioIspezione=jsonObj;
    obj.tipoEvento= {idTipoEvento: tipoEvento};
    obj.puntoVendita = { idPdv: puntoVendita};
    var evaluation= JSON.stringify(obj);
        $$.ajax({
        headers: {
           'Authorization': 'Bearer 102-token',
           'Access-Control-Allow-Origin': '*'
        },
        url :TEST_URL+'/GabrielliAppV2WS/rest/ispezione/merge',
        method: 'POST',
        data: evaluation,
        async: false,
        contentType: 'application/json',
        crossDomain: true,
        
        success: function (data) {
         
           if(status === "I"){
                 createPdfFromSavedIsp(parseInt($$(".idIspezione").text()));
                 prepareSaveAttach();
                 myApp.alert("Ispezione inviata", "Ispezione");
                 
           }else{
                prepareSaveAttach();
                myApp.alert("Ispezione salvata", "Ispezione");
           }

        },
        error: function (data, status, xhr) {
            if(status === "I"){
                myApp.hidePreloader();
                myApp.alert("Errore nell'invio dell'ispezione", "Errore");
            }else{
                myApp.hidePreloader();
                myApp.alert("Errore nel salvataggio dell'ispezione", "Errore");
            }
            
        }
    });
}
function getTipiEvento(){
    $$.ajax({
        headers: {
           'Authorization': 'Bearer 102-token',
           'Access-Control-Allow-Origin': '*'
        },
        url :TEST_URL+'/GabrielliAppV2WS/rest/tipiEvento',
        method: 'GET',
        async: false,
        contentType: 'application/json',
        crossDomain: true,
        
        success: function (data) {
            window.sessionStorage.setObj("tipiEvento",data);
            myApp.hidePreloader();
        },
        error: function (data, status, xhr) {
            myApp.hidePreloader();
            myApp.alert('Reperimento eventi fallito', "Errore");
        }
    });
}
function getPuntiVendita(){
    $$.ajax({
        headers: {
           'Authorization': 'Bearer 102-token',
           'Access-Control-Allow-Origin': '*'
        },
        url :TEST_URL+'/GabrielliAppV2WS/rest/puntiVendita',
        method: 'GET',
        async: false,
        contentType: 'application/json',
        crossDomain: true,
        
        success: function (data) {
            window.sessionStorage.setObj("puntiVendita",data);
            myApp.hidePreloader();
        },
        error: function (data, status, xhr) {
            myApp.hidePreloader();
            myApp.alert('Reperimento punti vendita fallito', "Errore");
        }
    });
}


function getControlliFromIdEvento(idTipoEvento, status){
        $$.ajax({
        headers: {
           'Authorization': 'Bearer 102-token',
           'Access-Control-Allow-Origin': '*',
           
        },
        url :TEST_URL+'/GabrielliAppV2WS/rest/tipiEventoControlli?idTipoEvento='+idTipoEvento,
        method: 'GET',
        async: false,
        contentType: 'application/json',
        crossDomain: true,
        
        success: function (data) {
            populateControlli(JSON.parse(data), status);
            myApp.hidePreloader();
        },
        error: function (data, status, xhr) {
            myApp.alert('Reperimento controlli fallito', "Errore");
            myApp.hidePreloader();
        }
    });
}

function getIspezioni(variableFilters){
      $$.ajax({
        headers: {
           'Authorization': 'Bearer 102-token',
           'Access-Control-Allow-Origin': '*'
        },
        url :TEST_URL+'/GabrielliAppV2WS/rest/ispezione/listIspezioni'+variableFilters,
        method: 'GET',
        async: false,
        contentType: 'application/json',
        crossDomain: true,
        
        success: function (data) {
            var objData = JSON.parse(data);
            populateListaIspezioni(objData);
            myApp.hidePreloader();
        },
        error: function (data, status, xhr) {
            myApp.alert('Reperimento ispezioni fallito', "Errore");
            myApp.hidePreloader();
        }
    });
}

function getIspezioneDetails(idIspezione){
      $$.ajax({
        headers: {
           'Authorization': 'Bearer 102-token',
           'Access-Control-Allow-Origin': '*'
        },
        url :TEST_URL+'/GabrielliAppV2WS/rest/ispezione/getIspezione?idIspezione='+idIspezione,
        method: 'GET',
        async: false,
        contentType: 'application/json',
        crossDomain: true,
        
        success: function (data) {
            var objData = JSON.parse(data);
            getControlliFromIdEvento(objData.tipoEvento.idTipoEvento, objData.status);
            populateIspezioneDetails(objData);
            myApp.hidePreloader();
        },
        error: function (data, status, xhr) {
            myApp.alert('Reperimento ispezione N. '+idIspezione+' fallito', "Errore");
            myApp.hidePreloader();
        }
    });
}

function saveAttach(formData, idIspezione){
      
      $$.ajax({
        headers: {
           'Authorization': 'Bearer 102-token',
           'Access-Control-Allow-Origin': '*',
           'idIspezione': parseInt(idIspezione)
          
        },
        url :TEST_URL+'/GabrielliAppV2WS/rest/allegatoIspezione/create',
        method: 'POST',
        data: formData,
        async: false,
        contentType: false,
        crossDomain: true,
        cache: false,
        processData: false,
        
        success: function (data) {
            
            myApp.hidePreloader();
        },
        error: function (data, status, xhr) {
            myApp.hidePreloader();
            myApp.alert("Errore nel caricamento degli allegati","Errore");
        }
    });
}

// Questa funzione serve per eseguire una get che ha come response uno stream di byte ( pdf) usa i metodi standard di js
function convertFileToDataURLviaFileReader(url, callback) {
                        var xhr = new XMLHttpRequest();
                        xhr.onload = function() {
                          var reader = new FileReader();
                          reader.onloadend = function() {
                            callback(reader.result);
                          }
                          reader.readAsDataURL(xhr.response);
                        };
                        xhr.open('GET', url);
                        xhr.responseType = 'blob';
                        xhr.send();
}

function createPdfFromSavedIsp(idIspezione){
         $$.ajax({
        headers: {
           'Authorization': 'Bearer 102-token',
           'Access-Control-Allow-Origin': '*'
        },
        url :TEST_URL+'/GabrielliAppV2WS/rest/pdf/create/'+idIspezione,
        method: 'GET',
        async: false,
        contentType: 'application/json',
        crossDomain: true,
        
        success: function (data) {
            myApp.hidePreloader();
            
        },
        error: function (data, status, xhr) {
            myApp.alert('Creazione pdf non riuscita',"Errore");
            myApp.hidePreloader();
        }
    });
}
