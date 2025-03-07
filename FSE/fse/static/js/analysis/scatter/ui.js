class UI_sctr{
    constructor(){
        this.players_sctr = document.getElementById('players-sctr');
        this.chart_sctr = document.getElementById('chart-sctr').getContext('2d');
        this.dlPlayers_sctr = document.getElementById('players-list-sctr');

        this.summary_stats = ['DEF', 'DRI', 'SHO', 'PAS', 'PHY', 'PAC'];

        // Generate colours to use for the plot points
        // First make 15 colours with a hue 24 points apart, then 14 more beginning at 12 rather than 1
        // Probably the best way to have a nice looking colour scheme while also ensuring colours are distinct
        this.backColors = []
        let i = 0;
        while(i < 15){
            let x = 1 + i * 24
            this.backColors.push(`hsla(${x}, 100%, 51%, 0.7)`);
            i++;
        }
        i = 0;
        while(i < 14){
            let x = 12 + i * 24
            this.backColors.push(`hsla(${x}, 100%, 51%, 0.7)`);
            i++;
        }
    }

    // Update the player options in the dropdown
    updatePlayerOptions(players){
        this.dlPlayers_sctr.innerHTML = "";
        players.forEach((player) => {
            this.dlPlayers_sctr.innerHTML += 
                `<option value="${player.id}">${player.name} (${player.overall})</option>`
        });
    }

    // Empty the player options dropdown
    emptyPlayerOptions(){
        this.dlPlayers_sctr.innerHTML = "";
    }

    // Clear any given field
    clearField(field){
        field.value = "";
    }

    // Update the players listed as being in the current plot
    updatePlayers_sctr(){
        let players = JSON.parse(sessionStorage.getItem('sctrChartPlayers'));
        this.players_sctr.innerHTML = "";
        if (players){
            players.forEach((player) => {
                this.players_sctr.innerHTML +=
                    `<li class="list-group-item">${player.info.full_name} (${player.info.overall})</li>`
            });   
        }
    }

    // Re-draw the chart as needed
    updateChart_sctr(xstat, ystat, focused){
        let players = JSON.parse(sessionStorage.getItem('sctrChartPlayers'));
        let labels = [];
        let stats = [];

        let min_x_val = 100;
        let max_x_val = -1;
        let min_y_val = 100;
        let max_y_val = -1;

        if(players){
            players.forEach((player) => {
                labels.push(`${player.info.full_name}`);

                let statpair = {};
                if(this.summary_stats.indexOf(xstat) > -1){
                    statpair['x'] = player.stats_summary[xstat];
                }else{
                    statpair['x'] = player.stats_ingame[xstat];
                }
                if(this.summary_stats.indexOf(ystat) > -1){
                    statpair['y'] = player.stats_summary[ystat];
                }else{
                    statpair['y'] = player.stats_ingame[ystat];
                }

                if(statpair['x'] < min_x_val){
                    min_x_val = statpair['x'];
                }
                if(statpair['y'] < min_y_val){
                    min_y_val = statpair['y'];
                }
                stats.push(statpair);
            });
        }

        if(!focused){
            min_x_val = 0;
            min_y_val = 0;
        }else{
            min_x_val = min_x_val - 5;
            min_y_val = min_y_val - 5;
        }
        
        if(window.mychart_sctr) mychart_sctr.destroy();
        window.mychart_sctr = new Chart(this.chart_sctr, {
            type: 'scatter',
            data: {
                labels: labels,
                datasets: [{
                    fontSize: 24,
                    label: `${xstat} vs ${ystat}`,
                    data: stats,
                    pointBackgroundColor: this.backColors,
                    pointRadius: 7
                }]
            },
            options: {
                tooltips: {
                    bodyFontSize: 14,
                    footerFontStyle: 'normal',
                    callbacks: {
                        label: (tooltipItem, data) => `${data.labels[tooltipItem.index]}`,
                        afterLabel: (tooltipItem, data) => [`${xstat}: ${tooltipItem.xLabel}`, `${ystat}: ${tooltipItem.yLabel}`]
                    },
                    mode: 'nearest',
                    intersect: false
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            suggestedMin: min_y_val,
                            suggestedMax: 100
                        },
                        scaleLabel: {
                            display: true,
                            labelString: ystat,
                            fontSize: 20,
                          }
                    }],
                    xAxes: [{
                        ticks: {
                            suggestedMin: min_x_val,
                            suggestedMax: 100
                        },
                        scaleLabel: {
                            display: true,
                            labelString: xstat,
                            fontSize: 20,
                          }
                    }]
                }
            }
        });
    }
}