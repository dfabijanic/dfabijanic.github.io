

const dbRefTransaction = firebase.database().ref().child('Transakcije');

const trenutnaGodina = moment().format('YYYY');

(function(){

    dbRefTransaction.orderByChild("Datum").once('value', (data) => {
        var element = data.val();
        var elementkey = data.key;
        
        let uplata = Array(12).fill(0);
        let isplate = Array(12).fill(0);
        
        data.forEach(element => {
            if(moment(element.val().Datum).format('YYYY') === trenutnaGodina)
            {
                var mj = parseInt(moment(element.val().Datum).format('M'))-1;
                if(element.val().TipTransakcije == 1)
                {
                    if(uplata[mj] == 0)
                    {
                        uplata[mj] = Number(parseFloat(element.val().Iznos).toFixed(2));
                    }
                    else{
                        uplata[mj] += Number(parseFloat(element.val().Iznos).toFixed(2));
                    }
                    console.log(uplata)
                }
                else{
                    if(isplate[mj] == 0)
                    {
                       
                        isplate[mj] = Number(parseFloat(element.val().Iznos).toFixed(2));
                    }
                    else{
                        isplate[mj] += Number(parseFloat(element.val().Iznos).toFixed(2));
                    }
                }
            }
        })
 
    
    var ctx = document.getElementById('myChart').getContext('2d');
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',
    
        // The data for our dataset
        data: {
            labels: ['Sijecanj', 'Veljaca', 'Ozujak', 'Travanj', 'Svibanj', 'Kolovoz', 'Rujan', 'Listopad', 'Studeni', 'Prosinac'],
            datasets: [{
                label: 'Isplata',
                fill: false,
                borderColor: 'rgb(111, 78, 124)',
                data: isplate
            },
                {
                label: 'Uplata',
                fill: false,
                borderColor: 'rgb(216, 133, 69)',
                data: uplata
                }]
        },
    
        // Configuration options go here
        options: {}
    });
})
})()