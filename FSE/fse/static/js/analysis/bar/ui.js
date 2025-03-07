class UI_bar{
    constructor(){
        this.dlPlayers_bar = document.getElementById('players-list-bar');
        this.players_bar = document.getElementById('players-bar');
        this.chart_bar = document.getElementById('chart-bar').getContext('2d');
        this.maxPlayers_bar = document.getElementById('max-players-bar');

        this.summary_stats = ['DEF', 'DRI', 'SHO', 'PAS', 'PHY', 'PAC'];
        
        this.backColors = ['rgba(255, 15, 15, 0.3)', 'rgba(255, 135, 15, 0.3)', 
                        'rgba(255, 255, 15, 0.3)', 'rgba(135, 255, 15, 0.3)', 
                        'rgba(15, 255, 15, 0.3)', 'rgba(15, 255, 255, 0.3)', 
                        'rgba(15, 15, 255, 0.3)', 'rgba(255, 15, 255, 0.3)']

        this.borderColors = ['rgba(255, 15, 15, 0.5)', 'rgba(255, 135, 15, 0.5)', 
                        'rgba(255, 255, 15, 0.5)', 'rgba(135, 255, 15, 0.5)', 
                        'rgba(15, 255, 15, 0.5)', 'rgba(15, 255, 255, 0.5)', 
                        'rgba(15, 15, 255, 0.5)', 'rgba(255, 15, 255, 0.5)']
    }

    // As the search term is updated, update the list of players available to choose from in the dropdown
    updatePlayerOptions(players){
        this.dlPlayers_bar.innerHTML = "";
        players.forEach((player) => {
            this.dlPlayers_bar.innerHTML += 
                `<option value="${player.id}">${player.name} (${player.overall})</option>`
        });
    }

    // Empty player options
    emptyPlayerOptions(){
        this.dlPlayers_bar.innerHTML = "";
    }

    // Clear any given field
    clearField(field){
        field.value = "";
    }

    // Update the players shown to be present in the bar chart
    updatePlayers_bar(){
        let players = JSON.parse(sessionStorage.getItem('barChartPlayers'));
        this.players_bar.innerHTML = "";
        if (players){
            players.forEach((player) => {
                this.players_bar.innerHTML +=
                    `<li class="list-group-item">${player.info.full_name} (${player.info.overall})</li>`
            });   
        }
    }

    // Warn the user when they have reached the 8 player limit in the bar chart
    displayMaxPlayersWarning(){
        this.maxPlayers_bar.className = "failed";
        this.maxPlayers_bar.innerHTML = "Maximum 8 players in bar chart";
        setTimeout(this.clearWarning, 5000);
    }
    
    // Remove the warning label
    clearWarning(){
        this.maxPlayers_bar.innerHTML = "";
    }

    // Re-draw the chart
    updateChart_bar(stat, focused){
        let players = JSON.parse(sessionStorage.getItem('barChartPlayers'));
        let labels = [];
        let stats = [];

        // For each player add a label to the list of labels and add statistic of concern to the list of stats
        if (players){
            players.forEach((player) => {
                labels.push(`${player.info.full_name}`);
                if(this.summary_stats.indexOf(stat) > -1){
                    stats.push(player.stats_summary[stat]);
                }else{
                    stats.push(player.stats_ingame[stat]);
                } 
            }); 
        }

        // Find the minimum and maximum value of the stats for dynamic resizing of the graph
        let min_val;
        let max_val;
        if(focused){
            min_val = Math.min(...stats) - 5;
            max_val = Math.max(...stats) + 5;
        }else{
            min_val = 0;
            max_val = 100
        }

        if(window.mychart_bar) mychart_bar.destroy();
        window.mychart_bar = new Chart(this.chart_bar, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: stat,
                    data: stats,
                    backgroundColor: this.backColors,
                    borderColor: this.borderColors,
                    borderWidth: 3
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            suggestedMin: min_val,
                            suggestedMax: max_val
                        }
                    }]
                }
            }
        });
    }
}