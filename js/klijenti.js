//podatci: klijenti, bankovni racuni, transakcije
const dbRefClient = firebase.database().ref().child('Klijenti');
const dbRefBankingAcc = firebase.database().ref().child('BankovniRacuni');
const dbRefTransaction = firebase.database().ref().child('Transakcije');

var validateclient;

//podaci: tip racuna, tip transakcije
const dbRefTypeAcc = firebase.database().ref().child('TipRacuna');
const dbRefTypeTrans = firebase.database().ref().child('TipTransakcije');

let Transakcija = {};
let Racun = {};

//validatori za brojeve
$(document).on("keyup", 'input[name^="inputAmountTrans"]', function (e) {
    var float = parseFloat($(this).attr('data-float'));

    /* 2 regexp for validating integer and float inputs *****
        > integer_regexp : allow numbers, but do not allow leading zeros
        > float_regexp : allow numbers + only one dot sign (and only in the middle of the string), but do not allow leading zeros in the integer part
    *************************************************************************/
    var integer_regexp = (/[^0-9]|^0+(?!$)/g);
    var float_regexp = (/[^0-9\.]|^\.+(?!$)|^0+(?=[0-9]+)|\.(?=\.|.+\.)/g);

    var regexp = (float % 1 === 0) ? integer_regexp : float_regexp;
    if (regexp.test(this.value)) {
        this.value = this.value.replace(regexp, '');
    }
});

$(document).on("keyup", 'input[name^="inputOIB"]', function (e) {
    var float = parseFloat($(this).attr('data-float'));

    /* 2 regexp for validating integer and float inputs *****
        > integer_regexp : allow numbers, but do not allow leading zeros
        > float_regexp : allow numbers + only one dot sign (and only in the middle of the string), but do not allow leading zeros in the integer part
    *************************************************************************/
    var integer_regexp = (/[^0-9]|^0+(?!$)/g);
    var float_regexp = (/[^0-9\.]|^\.+(?!$)|^0+(?=[0-9]+)|\.(?=\.|.+\.)/g);

    var regexp = (float % 1 === 0) ? integer_regexp : float_regexp;
    if (regexp.test(this.value)) {
        this.value = this.value.replace(regexp, '');
    }
});


$(document).on("keyup", 'input[name^="inputAmountTrans"]', function (e) {
    var val = this.value;
        var re = /^([0-9]+[\.]?[0-9]?[0-9]?|[0-9]+)$/g;
        var re1 = /^([0-9]+[\.]?[0-9]?[0-9]?|[0-9]+)/g;
        if (re.test(val)) {
            //do something here
    
        } else {
            val = re1.exec(val);
            if (val) {
                this.value = val[0];
            } else {
                this.value = "";
            }
        }
}); 

$(document).on("keyup", 'input[name^="EditStateAcc"]', function (e) {
    var numberRegex = /^[+-]?\d+(\.\d+)?([eE][+-]?\d+)?$/;
    var str = $('#EditStateAcc').val();
    if(numberRegex.test(str)) {
        $("#mess").text("");
    }  
    else {
        $("#mess").text("Stanje računa mora biti brojčano");
    }  
}); 

$(document).ready(function () {

// inputi validatori string
    $('#inputFirstName').keydown(function (e) {
        if ( e.ctrlKey || e.altKey) {
            e.preventDefault();
        } else {
            var key = e.keyCode;
            if (!((key == 8) || (key == 32) || (key == 46) || (key >= 35 && key <= 40) || (key >= 65 && key <= 90))) {
                e.preventDefault();
            }
        }
    });

    
    $('#inputLastName').keydown(function (e) {
        if ( e.ctrlKey || e.altKey) {
            e.preventDefault();
        } else {
            var key = e.keyCode;
            if (!((key == 8) || (key == 32) || (key == 46) || (key >= 35 && key <= 40) || (key >= 65 && key <= 90))) {
                e.preventDefault();
            }
        }
    });

    $('#EditLastName').keydown(function (e) {
        if ( e.ctrlKey || e.altKey) {
            e.preventDefault();
        } else {
            var key = e.keyCode;
            if (!((key == 8) || (key == 32) || (key == 46) || (key >= 35 && key <= 40) || (key >= 65 && key <= 90))) {
                e.preventDefault();
            }
        }
    });

    $('#EditFirstName').keydown(function (e) {
        if ( e.ctrlKey || e.altKey) {
            e.preventDefault();
        } else {
            var key = e.keyCode;
            if (!((key == 8) || (key == 32) || (key == 46) || (key >= 35 && key <= 40) || (key >= 65 && key <= 90))) {
                e.preventDefault();
            }
        }
    });

$.extend($.validator.messages,{
    require_from_group : ("Unesite jedno od polja{0}")
})

    $("#formClient").validate({
        ignore: [],        
        rules: {

            bankAccZiro:{
                require_from_group: [1,".send"]
            },
            bankAccTek:{
                require_from_group: [1,".send"]
            },

            inputFirstName: "required",
            inputLastName: "required",
            inputOIB: {
                required: true,
                exactlength: 11
            }

        },
        errorElement: 'div',
        wrapper: 'div',
        errorPlacement: function (error, element) {
            error.addClass("invalid-feedback");  
            if(element.attr('readonly') )
            {
                $('#ErrMess').empty().append(error);  

            }
            else{
                error.insertAfter(element)
            }
            

        },
        messages: {
            inputOIB: {
                required: "Molim Vas unesite OIB",
                exactlength: "OIB mora sadržavati točno 11 znamenki"
            },
            inputFirstName: "Molim Vas unesite ime",
            inputLastName: "Molim Vas unesite prezime",
            bankAccZiro: {
                require_from_group: "Odaberite barem jedan racun"
            },
            bankAccTek: {
                require_from_group: "Odaberite barem jedan racun"
            }
            
            
        },
        // Make sure the form is submitted to the destination defined
        // in the "action" attribute of the form when valid
        submitHandler: function (form, event) {
            $.confirm({
                alignMiddle: true,
                title: 'Potvrda!',
                content: 'Jeste li sigurni da želite dodati klijenta?',
                buttons: {
                    Spremi: function () {

                        const inputOIB = $('#inputOIB').val();
                        const inputLastName = $('#inputLastName').val();
                        const inputFirstName = $('#inputFirstName').val();
                        const inputNumberAccTek = $('#inputNumberAccTek').val();
                        const inputNumberAccZiro = $('#inputNumberAccZiro').val();

                        dbRefClient.child(inputOIB).set({
                            Ime: inputFirstName,
                            Prezime: inputLastName
                        })

                        if (inputNumberAccTek !== "") {
                            dbRefBankingAcc.child(inputNumberAccTek).set({
                                OIBKlijenta: inputOIB,
                                StanjeRacuna: 0,
                                TipRacuna: 1
                            })
                        }

                        if (inputNumberAccZiro !== "") {
                            dbRefBankingAcc.child(inputNumberAccZiro).set({
                                OIBKlijenta: inputOIB,
                                StanjeRacuna: 0,
                                TipRacuna: 2
                            })
                        }

                        $.alert('Klijent je dodan!');
                    },
                    Odustani: function () {
                    }
                }
            });
            return false;
        }
    });

    $.validator.addMethod("exactlength", function (value, element, param) {
        return this.optional(element) || value.length == param;
    })

    $.validator.addMethod('positiveNumber',
    function (value) { 
        return Number(value) > 0;
    }, 'Enter a positive number.');

    //counteri redova po tablicama
    var countClient = 1;
    var countBankingAcc = 1;
    var countTransaction = 1;

    dbRefTypeAcc.once("value", (snap) => {
        Racun = snap.val();
    })
    dbRefTypeTrans.once("value", (snap) => {
        Transakcija = snap.val();
    })

    //
    //KIJENTI BAZA
    //

    //listener dodavanja klijenta
    $('#spinner-client').show();
    dbRefClient.on('child_added', (data) => {

        var element = data.val();
        var elementkey = data.key;
        $('#table_client > tbody').append(
            `<tr>
            <th scope="row">${countClient++}</th>
            <td>${elementkey}</td>
            <td>${element.Prezime}</td>
            <td>${element.Ime}</td>
            <td><div>
                <button type="button" class="btn btn-secondary actions details" data-bs-toggle="modal" data-bs-target="#ModalDetailsClient"><i class="fas fa-info-circle"></i></button>
                <button type="button" class="btn btn-secondary actions edit" data-bs-toggle="modal" onclick="EditClient()" data-bs-target="#ModalEditClient"><i class="fas fa-user-edit"></i></button>
                <button type="button" class="btn btn-secondary actions remove" ><i class="fas fa-user-minus"></i></button>
                <button type="button" class="btn btn-secondary actions trans" data-bs-toggle="modal" onclick="ClientAddTrans()" data-bs-target="#ModalClientAddTrans" >Transakcija <i class="fas fa-coins"></i></button>
              </div></td>
          </tr>`
        )
        $('#spinner-client').hide();
        $('#table_client').show();
    })

    //datalist postojecih klijenata
    dbRefClient.on('value', (data) => {
        data.forEach(element => {
            var elements = element.val();
            var elementkey = element.key;
            $('#datalistOptionsClients').append(`<option value="${elements.Prezime} ${elements.Ime}" data-oib="${elementkey}">${elements.Prezime} ${elements.Ime}</option>`);
        });
    })

    //datalist postojecih racuna
    dbRefBankingAcc.on('value', (data) => {
        data.forEach(element => {
            var elements = element.val();
            var elementkey = element.key;
            $('#datalistOptionsBankingAcc').append(`<option value="${elementkey}">${Racun[elements.TipRacuna]}</option>`);
    })})

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
    $('#spinner-banc').show();
    dbRefBankingAcc.on('child_added', function (snap) {

        var element = snap.val();
        var elementkey = snap.key;
        $('#table_bankacc > tbody').append(
            `<tr>
                <th scope="row">${countBankingAcc++}</th>
                <td>${elementkey}</td>
                <td>${Racun[element.TipRacuna]}</td>
                <td>${element.OIBKlijenta}</td>
                <td>${element.StanjeRacuna}</td>
                <td><div>
                    <button type="button" id="detalji" class="btn  actions details" data-bs-toggle="modal"  data-bs-target="#staticBackdrop"><i class="fas fa-info-circle"></i></button>
                    <button type="button" class="btn btn-secondary actions edit"  data-bs-toggle="modal" data-bs-target="#ModalEditBankingAcc"><i class="fas fa-edit"></i></button>
                    <button type="button" class="btn btn-secondary actions remove"><i class="fas fa-trash-alt"></i></button>
                  </div></td>
              </tr>`
        )
        $('#spinner-banc').hide();
        $('#table_bankacc').show();
    });

    dbRefBankingAcc.on('child_removed', (data) => {
        $(`#table_bankacc tr:contains(${data.key})`).remove();
    })

    dbRefBankingAcc.on('child_changed', (data) => {
        var element = data.val();

        currentRow = $(`#table_bankacc tr:contains(${data.key})`).closest("tr");
        currentRow.find('td:eq(2)').text(element.OIBKlijenta);
        currentRow.find('td:eq(3)').text(element.StanjeRacuna);

       
    })

    //
    //TRANSAKCIJE BAZA
    //

    //realtime citanje transakcija
    $('#spinner-trans').show();
    dbRefTransaction.on('child_added', function (snap) {

        var element = snap.val();
        var elementkey = snap.key;
        $('#table_trans > tbody').append(
            `<tr>
                <th scope="row">${countTransaction++}</th>
                <td>${elementkey}</td>
                <td>${moment(element.Datum).format('DD.MM.YYYY')}</td>
                <td>${Transakcija[element.TipTransakcije]}</td>
                <td>${element.BrojRacuna}</td>
                <td>${element.Iznos}</td>
                <td><div>
                    <button type="button" id="detalji" class="btn btn-secondary actions details" data-bs-toggle="modal" onclick="DetailsTrans()" data-bs-target="#staticBackdrop"><i class="fas fa-info-circle"></i></button>
                    <button type="button" class="btn btn-secondary actions remove"><i class="fas fa-trash-alt"></i></button>
                  </div></td>
              </tr>`

        )
        $('#spinner-trans').hide();
        $('#table_trans').show();

    });

    dbRefTransaction.on('child_removed', (data) => {
        $(`#table_trans tr:contains(${data.key})`).remove();
    })

    //-----------------------------------------

    //Modal detalji klijenta
    $('#table_client').on('click', '.details', function () {
        var currentRow = $(this).closest('tr');

        var clientOib = currentRow.find('td:eq(0)').text();
        var clientLastName = currentRow.find('td:eq(1)').text();
        var clientFirstName = currentRow.find('td:eq(2)').text();

        DetailsClient(clientOib);

        $('#detailsOIB').val(clientOib);
        $('#detailsLastName').val(clientLastName);
        $('#detailsFirstName').val(clientFirstName);
    });

    $("#ModalDetailsClient").on('hidden.bs.modal', function () {
        $(".tableid").remove();
    });

    $("#myModal").on('hidden.bs.modal', function () {
        $(this).find('form').trigger('reset');
        // console.log(validateclient)
        $("#formClient").validate().resetForm();
        $("#message").html("");
        removeAcc('UkloniTekuci', '#inputNumberAccTek', '#showTekuci', '#currentButton');
        removeAcc('UkloniZiro', '#inputNumberAccZiro', '#showZiro', '#currentZiro');

    });

    $("#myModalAcc").on('hidden.bs.modal', function () {
        $(this).find('form').trigger('reset');
        $("#formAcc").validate().resetForm();
        $("#message").html("");

    });

    $("#myModalTrans").on('hidden.bs.modal', function () {
        $(this).find('form').trigger('reset');
        $("#formTrans").validate().resetForm();


    });

    //Modal brisanje korisnika
    $('#table_client').on('click', '.remove', function () {
        var currentRow = $(this).closest('tr');
        clientOib = currentRow.find('td:eq(0)').text();
        $.confirm({
            alignMiddle: true,
            title: 'Potvrda!',
            content: 'Jeste li sigurni da želite izbrisati klijenta i sve zapise klijenta?',
            buttons: {
                Izbriši: function () {

                    dbRefBankingAcc.on('value', function (snap) {
                        snap.forEach((childSnapshot) => {

                            var elementAcc = childSnapshot.val();
                            var elementAcckey = childSnapshot.key;

                            if (elementAcc.OIBKlijenta === clientOib) {

                                dbRefTransaction.on('value', function (snap) {
                                    snap.forEach((childSnapshot) => {

                                        var element = childSnapshot.val();
                                        var elementkey = childSnapshot.key;

                                        if (elementAcckey === element.BrojRacuna) {
                                            firebase.database().ref('Transakcije/' + elementkey).remove();
                                        }

                                    })
                                });
                                firebase.database().ref('BankovniRacuni/' + elementAcckey).remove();
                            }
                        })
                    });

                    firebase.database().ref('Klijenti/' + clientOib).remove();
                },
                Odustani: function () {
                }
            }
        });
    })

    //Modal detalji bankovnog racuna
    $('#table_bankacc').on('click', '.details', function () {
        var currentRow = $(this).closest('tr');

        var accNumber = currentRow.find('td:eq(0)').text();
        var accTypeAcc = currentRow.find('td:eq(1)').text();
        var accOIB = currentRow.find('td:eq(2)').text();
        var accState = currentRow.find('td:eq(3)').text();

        $('#detailsOIB').val(accOIB);
        $('#detailsTypeAcc').val(accTypeAcc);
        $('#detailsNumberAcc').val(accNumber);
        $('#detailsStateAcc').val(accState);

        DetailsBankingAcc(accNumber, accTypeAcc);
    })

    $("#staticBackdrop").on('hidden.bs.modal', function () {
        $(".tableid").remove();
    });

    //Modal uredi bankovni racun
    $('#table_bankacc').on('click', '.edit', function () {

        var currentRow = $(this).closest('tr');

        var accNumber = currentRow.find('td:eq(0)').text();
        var accType = currentRow.find('td:eq(1)').text();
        var accClient = currentRow.find('td:eq(2)').text();
        var accState = currentRow.find('td:eq(3)').text();

        $('#EditBankingNumber').val(accNumber);
        $('#EditTypeAcc').val(accType);
        $('#EditStateAcc').val(accState);
        $('#ClientAcc').val(accClient);
    });

    //Modal brisanje bankovnog racuna
    $('#table_bankacc').on('click', '.remove', function () {
        var currentRow = $(this).closest('tr');
        let accNumber = currentRow.find('td:eq(0)').text();
        $.confirm({
            alignMiddle: true,
            title: 'Potvrda!',
            content: 'Jeste li sigurni da želite izbrisati bankovni racun i sve zapise racuna?',
            buttons: {
                Izbriši: function () {

                    dbRefTransaction.on('value', function (snap) {
                        snap.forEach((childSnapshot) => {

                            var element = childSnapshot.val();
                            var elementkey = childSnapshot.key;

                            if (element.BrojRacuna === accNumber) {
                                firebase.database().ref('Transakcije/' + elementkey).remove();
                            }

                        })
                        firebase.database().ref('BankovniRacuni/' + accNumber).remove();
                    });


                },
                Odustani: function () {
                }
            }
        });
    })

    //Modal brisanje transakcija
    $('#table_trans').on('click', '.remove', function () {
        var currentRow = $(this).closest('tr');
        let accTrans = currentRow.find('td:eq(0)').text();
        $.confirm({
            alignMiddle: true,
            title: 'Potvrda!',
            content: 'Jeste li sigurni da želite izbrisati transakciju?',
            buttons: {
                Izbriši: function () {

                    firebase.database().ref('Transakcije/' + accTrans).remove();
                    $.alert("Transakcija uspješno obrisana!");

                },
                Odustani: function () {
                }
            }
        });
    })
    //ModalTransakcije
    $('#table_client').on('click', '.trans', function () {
        var currentRow = $(this).closest('tr');
        var clientOib = currentRow.find('td:eq(0)').text();
        ClientAddTrans(clientOib);
    })
    $("#ModalClientAddTrans").on('hidden.bs.modal', function () {
        $("#ClientTrans").children().remove();
    });
   
    //Modal validacija dodavanja klijenta
    $("#formClient").validate({
        errorElement: 'div',
        wrapper: 'div',
        errorPlacement: function (error, element) {
            error.addClass("invalid-feedback");
            error.insertAfter(element); // default function
        },
        rules: {
            inputFirstName: "required",
            inputLastName: "required",
            inputOIB: {
                required: true,
                minlength: 11,
                // maxlenght: 11
            }

        },
        messages: {
            inputFirstName: "Molim Vas unesite ime",
            inputLastName: "Molim Vas unesite prezime",
            inputOIB: {
                required: "Molim Vas unesite OIB",
                minlength: "OIB mora sadržavati točno 11 znamenki",
                // maxlenght: "OIB mora sadržavati točno 11 znamenki"
            }
        },
        // Make sure the form is submitted to the destination defined
        // in the "action" attribute of the form when valid
        submitHandler: function (form, event) {
            $.confirm({
                alignMiddle: true,
                title: 'Potvrda!',
                content: 'Jeste li sigurni da želite dodati klijenta?',
                buttons: {
                    Spremi: function () {

                        const inputOIB = $('#inputOIB').val();
                        const inputLastName = $('#inputLastName').val();
                        const inputFirstName = $('#inputFirstName').val();
                        const inputNumberAccTek = $('#inputNumberAccTek').val();
                        const inputNumberAccZiro = $('#inputNumberAccZiro').val();

                        dbRefClient.child(inputOIB).set({
                            Ime: inputFirstName,
                            Prezime: inputLastName
                        })

                        if (inputNumberAccTek !== "") {
                            dbRefBankingAcc.child(inputNumberAccTek).set({
                                OIBKlijenta: inputOIB,
                                StanjeRacuna: 0,
                                TipRacuna: 1
                            })
                        }

                        if (inputNumberAccZiro !== "") {
                            dbRefBankingAcc.child(inputNumberAccZiro).set({
                                OIBKlijenta: inputOIB,
                                StanjeRacuna: 0,
                                TipRacuna: 2
                            })
                        }

                        $.alert('Klijent je dodan!');
                    },
                    Odustani: function () {
                    }
                }
            });
            return false;
        }
    });


    //LIVE SEARCH 

    $('.notfound').hide();

    // Pretrazivanje kolona
    $('#txt_searchall').keyup(function () {
        var search = $(this).val();

        $('table tbody tr').hide();

        $('.notfound').hide();

        var len = $('table tbody tr:not(.notfound) td:contains("' + search + '")').length // broj rezultata;

        if (len > 0) {
            // Pretraga teksta i prikaz rezultantnih redova
            $('table tbody tr:not(.notfound) td:contains("' + search + '")').each(function () {
                $(this).closest('tr').show();
            });
        } else {
            $('.notfound').show();
        }
    });


   makeAllSortable();


});

// //SORTIRANJE

//da izbjegne malo veliko slovo
$.expr[":"].contains = $.expr.createPseudo(function (arg) {
    return function (elem) {
        return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
    };
});

function sortTable(table, col, reverse) {
    var tb = table.tBodies[0], // za ignoriranje sve osim tbodya
        tr = Array.prototype.slice.call(tb.rows, 0), //stavlja red u polje
        i;
    reverse = -((+reverse) || -1);
    tr = tr.sort(function (a, b) { 
        return reverse // -1 za suprotno
            * (a.cells[col].textContent.trim() // using `.textContent.trim()` for test
                .localeCompare(b.cells[col].textContent.trim())
            );
    });
    for (i = 0; i < tr.length; ++i) tb.appendChild(tr[i]); //apendanje redaka u dobrom poretku
}

function makeSortable(table) {
    var th = table.tHead, i;
    th && (th = th.rows[0]) && (th = th.cells);
    if (th) i = th.length;
    else return; // if no `<thead>` then do nothing
    while (--i >= 0) (function (i) {
        var dir = 1;
        th[i].addEventListener('click', function () { sortTable(table, i, (dir = 1 - dir)) });
    }(i));
}

function makeAllSortable(parent) {
    parent = parent || document.body;
    var t = parent.getElementsByTagName('table'), i = t.length;
    while (--i >= 0) makeSortable(t[i]);
}

//
//KLIJENTI
//

//detalji klijenta po kliknutom retku + transakcije po racunima
function DetailsClient(clientOib) {

    dbRefBankingAcc.on('value', function (snap) {
        snap.forEach((childSnapshot) => {

            var elementAcc = childSnapshot.val();
            var elementAcckey = childSnapshot.key;

            if (elementAcc.OIBKlijenta === clientOib) {

                $table = $('<table class="table transtabledetail table-hover table-striped tableid">');
                var trancount = 1;

                $table.append(`<caption style="caption-side:top">${Racun[elementAcc.TipRacuna]}(${elementAcckey})</caption>`)
                    .append('<thead>').children('thead')
                    .append('<tr />').children('tr').append('<th>Redni broj</th><th>Broj transakcije</th><th>Datum</th><th>Tip transakcije</th><th>Iznos(HRK)</th>');

                var $tbody = $table.append('<tbody />').children('tbody');

                let array = []
                dbRefTransaction.orderByChild("Datum").on('value', function (snap) {
                    snap.forEach((childSnapshot) => {
                        array.push(childSnapshot)                        
                    })
                });
                array.reverse();
                array.forEach((childSnapshot) => {
                    var element = childSnapshot.val();
                    var elementkey = childSnapshot.key;

                    if (elementAcckey === element.BrojRacuna) {
                        $tbody.append('<tr />').children('tr:last')
                            .append(`<td>${trancount++}</td>`)
                            .append(`<td>${elementkey}</td>`)
                            .append(`<td>${moment(element.Datum).format('DD.MM.YYYY')}</td>`)
                            .append(`<td>${Transakcija[element.TipTransakcije]}</td>`)
                            .append(`<td>${element.Iznos}</td>`);
                    }

                })


                $('#acc_detail_name').append($table);
                if (trancount === 1) {
                    $tbody.append('<tr />').children('tr:last')
                        .append(`<td colspan="5">Racun još nema izvršenih transakcija</td>`).addClass('text-center')
                }
            }
        })
    });
}

function Click() {
    $('#btnAddClient').trigger('click');
}

function ClickAcc() {
    $('#btnSubAcc').trigger('click')
}

function ClickTrans() {
    $('#btnSubTrans').trigger('click')
}
//dodavanje novog klijenta + mogucnost dodavanja ziro i tekuceg


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
    $.confirm({
        alignMiddle: true,
        title: 'Potvrda!',
        content: 'Jeste li sigurni da želite izvršiti promjene?',
        buttons: {
            Spremi: function () {

                var oib = $('#EditOIB').val();
                var lastname = $('#EditLastName').val();
                var firstname = $('#EditFirstName').val();

                var data = {
                    Ime: firstname,
                    Prezime: lastname
                }
                var updates = {};
                updates['/Klijenti/' + oib] = data;
                firebase.database().ref().update(updates);

                $.alert('Promjene su izvšene!');
            },
            Odustani: function () {
            }
        }
    });
}

//Dodavanje transakcije sa stranice Klijenti
function ClientAddTrans(clientOib) {
    dbRefBankingAcc.once('value', function (snap) {

        snap.forEach((childSnapshot) => {

            var elementAcc = childSnapshot.val();
            var elementAcckey = childSnapshot.key;
            var $collapse

            if (elementAcc.OIBKlijenta === clientOib) {
                var randid = Math.floor((Math.random() * 1000) + 1);
                var randidsl = "ad" + randid

                //onsubmit="event.preventDefault();"
                $collapse = $(`<p>
                <button
                  class="btn btn-primary"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#${randidsl}"
                  aria-expanded="false"
                  aria-controls="collapseExample"
                >
                  +${Racun[elementAcc.TipRacuna]}(${elementAcckey})
                </button>
              </p>
              <div class="collapse" id="${randidsl}">
                <div class="card card-body">
                <form id="formClient${randidsl}">
                <input id="datetrans${randidsl}" class="form-control" type="date" name="datetrans${randidsl}" style="margin-bottom: 10px;"/>
                <div class="form-floating mb-3">
                  <input
                    class="form-control"
                    id="inputTransNumber${randidsl}"
                    placeholder="Horvat"
                    value=${generateID(8)}
                    disabled
                  />
                  <label for="floatingInput" id="inputTransNumber">Broj transakcije</label>
                </div>
                <select
                  id="selectTypeTrans${randidsl}"
                  class="form-select form-select-lg mb-3"
                  aria-label="Default select example"
                  name="selectTypeTrans${randidsl}"
                  required
                >
                  <option value="">Tip transakcije</option>
                  <option value="1">Uplata</option>
                  <option value="2">Isplata</option>
                </select>
                <div class="form-floating mb-3">
                  <input
                    class="form-control"
                    id="inputAmountTrans${randidsl}"
                    placeholder="Horvat"
                    data-float="0.1"
                    name="inputAmountTrans${randidsl}"
                  />
                  <label for="floatingInput">Iznos(HRK)</label>
                  <input type="text" hidden value="${elementAcckey}" id="inputBankAccNumber${randidsl}">
                </div>
                <button
                type="submit"
                onclick="ClinetTransValidate(${randidsl})"
                class="btn btn-primary"
              >
                Spremi transakciju
              </button>
              </form>
                </div>
              </div>`)
                $collapse.appendTo('#ClientTrans');
            }
        })
    });
}

function ClinetTransValidate(partId) {

    let id = $(partId).attr('id')
    let rule = new Object();
    let message = new Object();

    let tipTrans = "selectTypeTrans" + id;
    let iznos = "inputAmountTrans" + id;
    let datum = "datetrans" + id;
    let brojTrans = "inputTransNumber" + id;
    let brojAcc = "inputBankAccNumber" + id;

    rule[tipTrans] = { required: true };
    rule[iznos] = { required: true, min: 1};
    rule[datum] = { required: true };

    message[tipTrans] = { required: 'Molim Vas odaberite tip transakcije' };
    message[iznos] = { required: 'Molim Vas unesite iznos', min: 'Iznos transakcije mora biti veći od nule'};
    message[datum] = { required: 'Molim Vas odaberite datum' };

    $(`#formClient${id}`).validate({
        errorElement: 'div',
        wrapper: 'div',
        errorPlacement: function (error, element) {
            error.addClass("invalid-feedback");
            error.insertAfter(element); // default function
        },
        rules: rule,
        messages: message,
        // Make sure the form is submitted to the destination defined
        // in the "action" attribute of the form when valid
        submitHandler: function (form, event) {
            $.confirm({
                alignMiddle: true,
                title: 'Potvrda!',
                content: 'Da li ste sigurni da želite dodati transakciju?',
                buttons: {
                    Spremi: function () {
                        const inputNumberAcc = $(`#${brojAcc}`).val();
                        const inputTypeTrans = $(`#${tipTrans}`).val();
                        const inputAmountTrans = $(`#${iznos}`).val();
                        const inputDateTrans = $(`#${datum}`).val();
                        const inputTransNumber = $(`#${brojTrans}`).val();
                        let floatNum = parseFloat(inputAmountTrans).toFixed(2);

                        // console.log(moment(inputDateTrans).valueOf());
                        dbRefTransaction.child(inputTransNumber).set({
                            BrojRacuna: inputNumberAcc,
                            Datum: moment(inputDateTrans).valueOf() ,
                            Iznos: floatNum,
                            TipTransakcije: inputTypeTrans
                        })
                        var konacnoStanje = 0.0;
                        var tipracuna = "";
                        var OibKlijenta = "";



                        dbRefBankingAcc.orderByKey().equalTo(inputNumberAcc).on('value', (snap) => {
                            snap.forEach((snapchild) => {
                                tipracuna = snapchild.val().TipRacuna;
                                OibKlijenta = snapchild.val().OIBKlijenta;

                                var stanjeracuna = snapchild.val().StanjeRacuna;
                                if (inputTypeTrans == 1) {
                                    konacnoStanje = stanjeracuna + parseFloat(inputAmountTrans);
                                }
                                else {
                                    konacnoStanje = stanjeracuna - parseFloat(inputAmountTrans);
                                }
                            })
                        })

                        var data = {
                            StanjeRacuna: parseFloat(konacnoStanje).toFixed(2),
                            TipRacuna: tipracuna,
                            OIBKlijenta: OibKlijenta
                        }
                        var updates = {};
                        updates['/BankovniRacuni/' + inputNumberAcc] = data;
                        firebase.database().ref().update(updates);
                        $.alert("Transakcija je uspješno dodana");
                    },
                    Odustani: function () {
                    }
                }
            });
            return false;
        }
    });
}

//
//BANKOVNI RACUNI
//

//detalji bankovnog računa po redcima
function DetailsBankingAcc(accNumber, accTypeAcc) {
    $table = $('<table class="table transtabledetail table-hover table-striped tableid">');
    var trancount = 1;

    $table.append(`<caption style="caption-side:top"></caption>`)
        .append('<thead>').children('thead')
        .append('<tr />').children('tr').append('<th>Redni broj</th><th>Broj transakcije</th><th>Datum</th><th>Tip transakcije</th><th>Iznos(HRK)</th>');

    var $tbody = $table.append('<tbody />').children('tbody');

    var datums = [];
    dbRefTransaction.orderByChild('Datum').on('value', function (snap) {
        snap.forEach((childSnapshot) => {

            var element = childSnapshot.val();
               
            if (element.BrojRacuna === accNumber) {
                datums.push(childSnapshot)            
            }    

        })
    });

    datums.reverse();
        datums.forEach((childSnapshot) =>{
            let TransElementKey = childSnapshot.key;
            let TransElement = childSnapshot.val();

            $tbody.append('<tr />').children('tr:last')
            .append(`<td>${trancount++}</td>`)
            .append(`<td>${TransElementKey}</td>`)
            .append(`<td>${moment(TransElement.Datum).format('DD.MM.YYYY')}</td>`)
            .append(`<td>${Transakcija[TransElement.TipTransakcije]}</td>`)
            .append(`<td>${TransElement.Iznos}</td>`);
        })
        $('#acc_detail').append($table);
        if (trancount === 1) {
            $tbody.append('<tr />').children('tr:last')
                .append(`<td colspan="5">Racun još nema izvršenih transakcija</td>`).addClass('text-center')
        }
    
}

//dodavanje novog bankovnog racuna
function AddBankingAcc() {
    var val = $("#ClientsDataList").val();
    var obj = $("#datalistOptionsClients").find("option[value='" + val + "']");
    var oib = obj.data('oib');

if(obj != null && obj.length > 0) {
    
    $('#DataListErr').text("");
         $("#formAcc").validate({
            errorElement: 'div',
            wrapper: 'div',
            errorPlacement: function (error, element) {
                error.addClass("invalid-feedback");
                error.insertAfter(element); // default function
            },
            rules: {
                ClientsDataList: {required : true},
                selectTypeAcc:  {required : true}
    
            },
            messages: {            
                ClientsDataList: {required: "Molim Vas odaberite klijenta"},
                selectTypeAcc: {required: "Molim Vas odaberite tip racuna"}
                
            },
            
            submitHandler: function (form, event) {
                $.confirm({
                    alignMiddle: true,
                    title: 'Potvrda!',
                    content: 'Jeste li sigurni da želite dodati novi račun?',
                    buttons: {
                        Spremi: function () {
    
                            const inputOIBClient = oib;
                            const StateAcc = 0;
                            const inputNumberAcc = $('#inputNumberAcc').val();
                            const inputTypeAcc = $('#selectTypeAcc').val();
    
                            dbRefBankingAcc.child(inputNumberAcc).set({
                                OIBKlijenta: inputOIBClient,
                                StanjeRacuna: StateAcc,
                                TipRacuna: inputTypeAcc
                            })
    
                            $.alert('Račun je dodan!');
                        },
                        Odustani: function () {
                        }
                    }
                });
            }
        }); 
    }    
    else{
        $('#DataListErr').text("Odaberite postojećeg klijenta");
    }
}


function UpdateBankingAcc() {
    // console.log($("#mess").text().length);
    if($("#mess").text().length === 0)
    {

    $.confirm({
        alignMiddle: true,
        title: 'Potvrda!',
        content: 'Jeste li sigurni da želite izvršiti promjene?',
        buttons: {
            Spremi: function () {
                	
                var numberAcc = $('#EditBankingNumber').val();
                var tipRacunaVal = 1;
                var tipRacuna = $('#EditTypeAcc').val();
                if (tipRacuna === "Ziro"){
                    tipRacunaVal= 2;
                }                
                var stanjeRacuna = $('#EditStateAcc').val();
                var clientOib = $('#ClientAcc').val();

                var data = {
                    OIBKlijenta: clientOib,
                    StanjeRacuna: stanjeRacuna,
                    TipRacuna: tipRacunaVal
                }
                var updates = {};
                updates['/BankovniRacuni/' + numberAcc] = data;
                firebase.database().ref().update(updates);

                $.alert('Promjene su izvšene!');
            },
            Odustani: function () {
            }
        }
    });
}
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
        var transType = currentRow.find('td:eq(2)').text();
        var transNumberAcc = currentRow.find('td:eq(3)').text();
        var transAmount = currentRow.find('td:eq(4)').text();

        $('#detailsTypeTrans').val(transType);
        $('#detailsDate').val(transDate);
        $('#detailsNumberTrans').val(transNumber);
        $('#detailsNumberAcc').val(transNumberAcc);
        $('#detailsAmountTrans').val(transAmount);
    });
}

//dodavanje nove transakcije
function AddTransaction() {  
    $("#formTrans").validate({
        errorElement: 'div',
        wrapper: 'div',
        errorPlacement: function (error, element) {
            error.addClass("invalid-feedback");
            error.insertAfter(element); // default function
        },
        rules: {
            listBankingAcc: {required : true},
            selectTypeTrans:  {required : true},
            inputAmountTrans:  {required : true,  min: 1}, 
            datetrans: {required : true}
        },
        messages: {            
            listBankingAcc: {required: "Molim Vas odaberite broj racuna"},
            selectTypeTrans: {required: "Molim Vas odaberite tip transakcije"},
            inputAmountTrans: {required: "Molim Vas unesite iznos transakcije", min: "Iznos transakcije mora biti veći od nule"},     
            datetrans: {required: "Molim Vas odaberite datum"}     
        },
        
        submitHandler: function (form, event) {
            $.confirm({
                alignMiddle: true,
                title: 'Potvrda!',
                content: 'Jeste li sigurni da želite dodati novu transakciju?',
                buttons: {
                    Spremi: function () {

                        const inputNumberAcc = $('#listBankingAcc').val();
                        const inputTypeTrans = $('#selectTypeTrans').val();
                        const inputAmountTrans = $('#inputAmountTrans').val();
                        const inputDateTrans = $('#datetrans').val();
                        const inputTransNumber = $('#inputTransNumber').val();
                        let floatNum = parseFloat(inputAmountTrans).toFixed(2);
                        console.log(inputTransNumber);
                        dbRefTransaction.child(inputTransNumber).set({
                            BrojRacuna: inputNumberAcc,
                            Datum: moment(inputDateTrans).valueOf(),
                            Iznos: floatNum,
                            TipTransakcije: inputTypeTrans
                        })
                        var konacnoStanje = 0.0;
                        var tipracuna = "";
                        var OibKlijenta = "";
                        dbRefBankingAcc.orderByKey().equalTo(inputNumberAcc).on('value', (snap) => {
                            snap.forEach((snapchild) => {
                                tipracuna = snapchild.val().TipRacuna;
                                OibKlijenta = snapchild.val().OIBKlijenta;
                    
                                var stanjeracuna = parseFloat(snapchild.val().StanjeRacuna);
                                if (inputTypeTrans == 1) {
                                    konacnoStanje = stanjeracuna + floatNum;
                                }
                                else {
                                    konacnoStanje = stanjeracuna - floatNum;
                                }
                            })
                        })
                        var data = {
                            StanjeRacuna: parseFloat(konacnoStanje).toFixed(2),
                            TipRacuna: tipracuna,
                            OIBKlijenta: OibKlijenta
                        }
                        var updates = {};
                        updates['/BankovniRacuni/' + inputNumberAcc] = data;
                        firebase.database().ref().update(updates);
                    

                        $.alert('Transakcija je dodana!');
                    },
                    Odustani: function () {
                    }
                }
            });
        return false;
        }
    }); 
}

//
//GENERATOR
//

//generator bankovnog racuna i broja
function generateID(n) {
    var add = 1, max = 12 - add;   // 12 is the min safe number Math.random() can generate without it starting to pad the end with zeros.   

    if (n > max) {
        return generate(max) + generate(n - max);
    }

    max = Math.pow(10, n + add);
    var min = max / 10; // Math.pow(10, n) basically
    var number = Math.floor(Math.random() * (max - min + 1)) + min;

    return ("" + number).substring(add);
}

function generateBancAccNumber(currentbut, id, div, button) {
    var accnumber1 = generateID(8);
    var accnumber2 = generateID(8);
    var accnumber = accnumber1.concat(accnumber2);
    $(id).val(accnumber);
    $(div).removeAttr("hidden");
    $(button).removeAttr("hidden");
    $(`#${currentbut}`).prop("disabled", true);

    console.log(currentbut);
}

function generateTransNumber(id) {
    var transnumber = generateID(8);
    $(id).val(transnumber);
}

function removeAcc(currentbut, id, div, button) {
    $(id).val("");
    $(div).prop("hidden", true);
    $(button).prop("disabled", false);
    $(`#${currentbut}`).prop("hidden", true);
}

function generateNewAcc(id) {
    var accnumber1 = generateID(8);
    var accnumber2 = generateID(8);
    var accnumber = accnumber1.concat(accnumber2);
    $(id).val(accnumber);
}