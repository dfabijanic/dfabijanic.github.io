//podatci: klijenti, bankovni racuni, transakcije
const dbRefClient = firebase.database().ref().child('Klijenti');
const dbRefBankingAcc = firebase.database().ref().child('BankovniRacuni');
const dbRefTransaction = firebase.database().ref().child('Transakcije');

//podaci: tip racuna, tip transakcije
const dbRefTypeAcc = firebase.database().ref().child('TipRacuna');
const dbRefTypeTrans = firebase.database().ref().child('TipTransakcije');

$(document).ready(function () {
    var countClient = 1;
    var countBankingAcc = 1;
    var countTransaction = 1;
    var $load = $('<div class="spinner-border text-secondary" role="status"><span class="visually-hidden">Loading...</span></div>').appendTo('#loader');
    //
    //KIJENTI BAZA
    //

    //listener dodavanja klijenta

    dbRefClient.on('child_added', (data) => {
        $load.hide();
        var element = data.val();
        var elementkey = data.key;
        $('#table_client > tbody').append(
            `<tr>
            <th scope="row">${countClient++}</th>
            <td>${elementkey}</td>
            <td>${element.Prezime}</td>
            <td>${element.Ime}</td>
            <td><div>
                <button type="button" class="btn btn-secondary actions details" data-bs-toggle="modal" onclick="DetailsClient()" data-bs-target="#ModalDetailsClient">Detalji</button>
                <button type="button" class="btn btn-secondary actions edit" data-bs-toggle="modal" onclick="EditClient()" data-bs-target="#ModalEditClient">Uredi</button>
                <button type="button" class="btn btn-secondary actions remove" onclick="RemoveClient()">Izbriši</button>
                <button type="button" class="btn btn-secondary actions trans" data-bs-toggle="modal" onclick="ClientAddTrans()" data-bs-target="#ModalClientAddTrans" >Transakcija</button>
              </div></td>
          </tr>`

    )})

    //listener brisanja klijenta

    dbRefClient.on('child_removed', (data) => {
        $(`#table_client tr:contains(${data.key})`).remove();
    })

    //listener azuriranja klijenta
    dbRefClient.on('child_changed', (data) => {
        var element = data.val();

        currentRow = $(`#table_client tr:contains(${data.key})`).closest("tr");
        currentRow.find('td:eq(1)').text(element.Prezime);
        currentRow.find('td:eq(2)').text(element.Ime);
    })

    //
    //BANKOVNI RACUNI BAZA
    //

    //realtime citanje bankovnih racuna
    dbRefBankingAcc.on('value', function (snap) {
        snap.forEach((childSnapshot) => {

            var element = childSnapshot.val();
            var elementkey = childSnapshot.key;
            $('#table_bankacc > tbody').append(
                `<tr>
                <th scope="row">${countBankingAcc++}</th>
                <td>${elementkey}</td>
                <td>${element.TipRacuna}</td>
                <td>${element.OIBKlijenta}</td>
                <td>${element.StanjeRacuna}</td>
                <td><div>
                    <button type="button" id="detalji" class="btn btn-secondary actions details" data-bs-toggle="modal" onclick="DetailsBankingAcc()" data-bs-target="#staticBackdrop">Detalji</button>
                    <button type="button" class="btn btn-secondary actions">Uredi</button>
                    <button type="button" class="btn btn-secondary actions">Izbriši</button>
                  </div></td>
              </tr>`

            )
        })
    });

    //
    //TRANSAKCIJE BAZA
    //

    //realtime citanje transakcija
    dbRefTransaction.on('value', function (snap) {
        snap.forEach((childSnapshot) => {

            var element = childSnapshot.val();
            var elementkey = childSnapshot.key;
            $('#table_trans > tbody').append(
                `<tr>
                <th scope="row">${countTransaction++}</th>
                <td>${elementkey}</td>
                <td>${element.Datum}</td>
                <td>${element.TipTransakcije}</td>
                <td>${element.BrojRacuna}</td>
                <td>${element.Iznos}</td>
                <td><div>
                    <button type="button" id="detalji" class="btn btn-secondary actions details" data-bs-toggle="modal" onclick="DetailsTrans()" data-bs-target="#staticBackdrop">Detalji</button>
                    <button type="button" class="btn btn-secondary actions">Uredi</button>
                    <button type="button" class="btn btn-secondary actions">Izbriši</button>
                  </div></td>
              </tr>`

            )
        })
    });

    $("#ModalDetailsClient").on('hidden.bs.modal', function(){
        $(".tableid").remove();
      });
});

//
//KLIJENTI
//

//detalji klijenta po kliknutom retku + transakcije po racunima
function DetailsClient() {
    $('#table_client').on('click', '.details', function () {
        var currentRow = $(this).closest('tr');

        var clientOib = currentRow.find('td:eq(0)').text();
        var clientLastName = currentRow.find('td:eq(1)').text();
        var clientFirstName = currentRow.find('td:eq(2)').text();

        dbRefBankingAcc.on('value', function (snap) {
            snap.forEach((childSnapshot) => {

                var elementAcc = childSnapshot.val();
                var elementAcckey = childSnapshot.key;

                if (elementAcc.OIBKlijenta === clientOib) {
                    var $table = $('<table class="table transtabledetail table-hover table-striped tableid">');
                    var trancount = 1;

                    $table.append(`<caption style="caption-side:top">${elementAcc.TipRacuna}(${elementAcckey})</caption>`)
                        .append('<thead>').children('thead')
                        .append('<tr />').children('tr').append('<th>Redni broj</th><th>Broj transakcije</th><th>Datum</th><th>Tip transakcije</th><th>Iznos</th>');

                    var $tbody = $table.append('<tbody />').children('tbody');

                    dbRefTransaction.on('value', function (snap) {
                        snap.forEach((childSnapshot) => {

                            var element = childSnapshot.val();
                            var elementkey = childSnapshot.key;

                            if (elementAcckey === element.BrojRacuna) {
                                $tbody.append('<tr />').children('tr:last')
                                    .append(`<td>${trancount++}</td>`)
                                    .append(`<td>${elementkey}</td>`)
                                    .append(`<td>${element.Datum}</td>`)
                                    .append(`<td>${element.TipTransakcije}</td>`)
                                    .append(`<td>${element.Iznos}</td>`);
                            }

                        })
                    });
                    $table.appendTo('#acc_detail_name');
                }
            })
        });

        $('#detailsOIB').val(clientOib);
        $('#detailsLastName').val(clientLastName);
        $('#detailsFirstName').val(clientFirstName);
    });
}

//dodavanje novog klijenta + mogucnost dodavanja ziro i tekuceg
function AddClient() {
    const inputOIB = $('#inputOIB').val();
    const inputLastName = $('#inputLastName').val();
    const inputFirstName = $('#inputFirstName').val();
    const inputNumberAccTek = $('#inputNumberAccTek').val();
    const inputNumberAccZiro = $('#inputNumberAccZiro').val();

    dbRefClient.child(inputOIB).set({
        Ime: inputFirstName,
        Prezime: inputLastName
    })

    if (inputNumberAccTek !== "")
    {
    dbRefBankingAcc.child(inputNumberAccTek).set({
        OIBKlijenta: inputOIB,
        StanjeRacuna: 0,
        TipRacuna: 1
    })
    }

    if (inputNumberAccZiro !== "")
    {
    dbRefBankingAcc.child(inputNumberAccZiro).set({
        OIBKlijenta: inputOIB,
        StanjeRacuna: 0,
        TipRacuna: 2
    })
    }
}

//brisanje korisnika bez validacija postojecih bankovnih racuna
function RemoveClient() {
    var clientOib;
    $('#table_client').on('click', '.remove', function () {
        var currentRow = $(this).closest('tr');
        clientOib = currentRow.find('td:eq(0)').text();
        firebase.database().ref('Klijenti/' + clientOib).remove();
        // dbRefClient.on('child_removed', snap => {
        //     currentRow.remove();
        // })
    })

}

// funkcije za azuriranje klijenta EditClient() + UpdateClient()
function EditClient() {
    $('#table_client').on('click', '.edit', function () {
        var currentRow = $(this).closest('tr');

        var clientOib = currentRow.find('td:eq(0)').text();
        var clientLastName = currentRow.find('td:eq(1)').text();
        var clientFirstName = currentRow.find('td:eq(2)').text();

        $('#EditOIB').val(clientOib);
        $('#EditLastName').val(clientLastName);
        $('#EditFirstName').val(clientFirstName);
    });
}

function UpdateClient() {
    var oib = $('#EditOIB').val();
    var lastname = $('#EditLastName').val();
    var firstname= $('#EditFirstName').val();

    var data = {
        Ime: firstname,
        Prezime: lastname
    }
    var updates = {};
  updates['/Klijenti/' + oib] = data;
  firebase.database().ref().update(updates);

}

//Dodavanje transakcije sa stranice Klijenti
function ClientAddTrans()
{
    $('#table_client').on('click', '.trans', function () {
        var currentRow = $(this).closest('tr');
        var clientOib = currentRow.find('td:eq(0)').text();
   

    dbRefBankingAcc.on('value', function (snap) {
        snap.forEach((childSnapshot) => {

            var elementAcc = childSnapshot.val();
            var elementAcckey = childSnapshot.key;
            var $collapse
            if (elementAcc.OIBKlijenta === clientOib) {
                // var randid = Math.floor((Math.random() * 1000) + 1);
                var randid = "ad"

                $collapse = $(`<p>
                <button
                  class="btn btn-primary"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#${randid}"
                  aria-expanded="false"
                  aria-controls="collapseExample"
                >
                  +${elementAcc.TipRacuna}
                </button>
              </p>
              <div class="collapse" id="${randid}">
                <div class="card card-body">
                <form id="formClient">
                <input id="datetrans" type="date" />
                <div class="form-floating mb-3">
                  <input
                    class="form-control"
                    id="inputAccNumber"
                    placeholder="Horvat"
                  />
                  <label for="floatingInput">Broj računa</label>
                </div>
                <div class="form-floating mb-3">
                  <input
                    class="form-control"
                    id="inputTransNumber"
                    placeholder="Horvat"
                  />
                  <label for="floatingInput">Broj transakcije</label>
                </div>
                <select
                  id="selectTypeTrans"
                  class="form-select form-select-lg mb-3"
                  aria-label="Default select example"
                >
                  <option selected>Tip transakcije</option>
                  <option value="1">Uplata</option>
                  <option value="2">Isplata</option>
                </select>
                <div class="form-floating mb-3">
                  <input
                    class="form-control"
                    id="inputAmountTrans"
                    placeholder="Horvat"
                  />
                  <label for="floatingInput">Iznos</label>
                </div>
              </form>
                </div>
              </div>`)
              $collapse.appendTo('#ClientTrans');      
            }
})
})   
});  
}
//
//BANKOVNI RACUNI
//

//detalji bankovnog računa po redcima
function DetailsBankingAcc() {
    $('#table_bankacc').on('click', '.details', function () {
        var currentRow = $(this).closest('tr');

        var accNumber = currentRow.find('td:eq(0)').text();

        //dohvacanje tipova bankovnih racuna iz baze
        dbRefTypeAcc.on('value', function (snap) {
            var element = snap.val();
            var accTypeAcc = currentRow.find('td:eq(1)').text();
            $('#detailsTypeAcc').val(element[accTypeAcc]);

        })

        var accOIB = currentRow.find('td:eq(2)').text();
        var accState = currentRow.find('td:eq(3)').text();

        $('#detailsOIB').val(accOIB);
        $('#detailsNumberAcc').val(accNumber);
        $('#detailsStateAcc').val(accState);
    });
}

//dodavanje novog bankovnog racuna
function AddBankingAcc() {
    const inputOIBClient = $('#inputAccOIB').val();
    const StateAcc = 0;
    const inputNumberAcc = $('#inputNumberAcc').val();
    const inputTypeAcc = $('#selectTypeAcc').val();

    dbRefBankingAcc.child(inputNumberAcc).set({
        OIBKlijenta: inputOIBClient,
        StanjeRacuna: StateAcc,
        TipRacuna: inputTypeAcc
    })
}

//
//TRANSAKCIJE
//

//detalji transakcije po redcima
function DetailsTrans() {
    $('#table_trans').on('click', '.details', function () {
        var currentRow = $(this).closest('tr');

        var transDate = currentRow.find('td:eq(1)').text();
        var transNumber = currentRow.find('td:eq(0)').text();

        //dohvacanje tipova transakcija iz baze
        dbRefTypeTrans.on('value', function (snap) {
            var element = snap.val();
            var transType = currentRow.find('td:eq(2)').text();
            $('#detailsTypeTrans').val(element[transType]);

        })

        var transNumberAcc = currentRow.find('td:eq(3)').text();
        var transAmount = currentRow.find('td:eq(4)').text();

        $('#detailsDate').val(transDate);
        $('#detailsNumberTrans').val(transNumber);
        $('#detailsNumberAcc').val(transNumberAcc);
        $('#detailsAmountTrans').val(transAmount);
    });
}

//dodavanje nove transakcije
function AddTransaction() {
    const inputNumberAcc = $('#inputAccNumber').val();
    const inputTypeTrans = $('#selectTypeTrans').val();
    const inputAmountTrans = $('#inputAmountTrans').val();
    const inputDateTrans = $('#datetrans').val();
    const inputTransNumber = $('#inputTransNumber').val();

    dbRefTransaction.child(inputTransNumber).set({
        BrojRacuna: inputNumberAcc,
        Datum: inputDateTrans,
        Iznos: inputAmountTrans,
        TipTransakcije: inputTypeTrans
    })
}

