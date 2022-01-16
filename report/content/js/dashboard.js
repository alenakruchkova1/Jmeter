/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [1.0, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Click on button rename"], "isController": false}, {"data": [1.0, 500, 1500, "Assign User to Group -> ADD contact to the group "], "isController": false}, {"data": [1.0, 500, 1500, "Click on button delete name"], "isController": false}, {"data": [1.0, 500, 1500, "Opening an Add Contact page"], "isController": false}, {"data": [1.0, 500, 1500, "Open Home Page -> Click on button [Home]"], "isController": false}, {"data": [1.0, 500, 1500, "Click on button edit name"], "isController": false}, {"data": [1.0, 500, 1500, "Click Group  Button"], "isController": false}, {"data": [1.0, 500, 1500, "Authorization"], "isController": false}, {"data": [1.0, 500, 1500, "Click on button delete group"], "isController": false}, {"data": [1.0, 500, 1500, "Click NEXT Button on the Add Contact page"], "isController": false}, {"data": [1.0, 500, 1500, "Save New Contact "], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [1.0, 500, 1500, "Logout"], "isController": false}, {"data": [1.0, 500, 1500, "Opening a Group page"], "isController": false}, {"data": [1.0, 500, 1500, "ADD New group button action"], "isController": false}, {"data": [1.0, 500, 1500, "Open Home page -> Click on button [Home]"], "isController": false}, {"data": [1.0, 500, 1500, "Creating a new group -> Click on button [Enter information] add group"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2100, 0, 0.0, 22.499523809523858, 0, 87, 21.0, 34.0, 36.0, 40.0, 29.739566368798943, 1460.6292064669394, 15.008979955001204], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Click on button rename", 100, 0, 0.0, 26.75, 20, 36, 27.0, 31.0, 34.0, 35.989999999999995, 1.5630372940698365, 9.824910516114914, 2.675785523930101], "isController": false}, {"data": ["Assign User to Group -> ADD contact to the group ", 100, 0, 0.0, 19.209999999999987, 14, 25, 19.0, 22.0, 23.94999999999999, 25.0, 1.5634038428466457, 9.539206259868987, 1.561327447117865], "isController": false}, {"data": ["Click on button delete name", 100, 0, 0.0, 19.48, 14, 29, 19.0, 23.80000000000001, 25.0, 28.989999999999995, 1.5632083287739758, 9.524625294078568, 0.3695827503868941], "isController": false}, {"data": ["Opening an Add Contact page", 100, 0, 0.0, 18.859999999999992, 14, 24, 19.0, 22.0, 23.0, 24.0, 1.5610121602847287, 10.085876401008413, 0.28064681514493994], "isController": false}, {"data": ["Open Home Page -> Click on button [Home]", 100, 0, 0.0, 33.94000000000002, 25, 46, 34.0, 38.0, 42.89999999999998, 45.97999999999999, 1.5632816408204102, 288.1575522868856, 0.2825814762850175], "isController": false}, {"data": ["Click on button edit name", 200, 0, 0.0, 21.865000000000006, 16, 38, 22.0, 25.0, 25.94999999999999, 28.99000000000001, 3.0788651303129666, 40.86315502855647, 0.5715744738989208], "isController": false}, {"data": ["Click Group  Button", 100, 0, 0.0, 19.759999999999994, 14, 31, 19.0, 26.0, 28.0, 31.0, 1.5632572027075615, 11.254596953211712, 0.28257705880973594], "isController": false}, {"data": ["Authorization", 100, 0, 0.0, 30.970000000000002, 23, 87, 30.0, 35.0, 38.849999999999966, 86.56999999999978, 1.5593082908421825, 279.1145699330277, 1.013398112847141], "isController": false}, {"data": ["Click on button delete group", 100, 0, 0.0, 19.589999999999996, 13, 35, 19.0, 22.0, 27.0, 34.97999999999999, 1.5632327653587619, 9.536819016726591, 1.0492589299671722], "isController": false}, {"data": ["Click NEXT Button on the Add Contact page", 100, 0, 0.0, 22.93, 17, 29, 23.0, 26.0, 27.0, 29.0, 1.5609634266269141, 24.449046983047936, 1.018803023976398], "isController": false}, {"data": ["Save New Contact ", 100, 0, 0.0, 25.139999999999993, 19, 30, 26.0, 28.0, 29.0, 29.989999999999995, 1.560914696011863, 9.803748512253181, 2.64867712479513], "isController": false}, {"data": ["Debug Sampler", 100, 0, 0.0, 0.21, 0, 2, 0.0, 1.0, 1.0, 2.0, 1.5641374563996684, 0.4809111687235074, 0.0], "isController": false}, {"data": ["Logout", 100, 0, 0.0, 14.370000000000003, 11, 22, 14.0, 17.0, 18.0, 21.969999999999985, 1.5635260639794866, 8.259173744879453, 0.761699816676569], "isController": false}, {"data": ["Opening a Group page", 200, 0, 0.0, 18.984999999999996, 13, 32, 19.0, 22.0, 23.0, 29.0, 3.08090455357693, 21.727898842350115, 0.5569096024092673], "isController": false}, {"data": ["ADD New group button action", 100, 0, 0.0, 18.840000000000003, 14, 27, 19.0, 21.0, 22.0, 27.0, 1.563721657544957, 10.652991228498827, 0.770224540656763], "isController": false}, {"data": ["Open Home page -> Click on button [Home]", 300, 0, 0.0, 33.30999999999995, 24, 45, 33.0, 39.0, 40.0, 43.0, 4.45467369515183, 814.7535834601678, 0.8052344736060584], "isController": false}, {"data": ["Creating a new group -> Click on button [Enter information] add group", 100, 0, 0.0, 20.809999999999995, 14, 32, 21.0, 25.0, 27.94999999999999, 32.0, 1.5637461101815509, 9.591872038655804, 1.8522297797854541], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2100, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
