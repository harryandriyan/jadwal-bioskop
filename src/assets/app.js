'use strict';

jQuery(document).ready(function($) {

    function getKota() {
        $.ajax({
            url: '/api/kota',
            type: 'GET',
            dataType: 'json',
            data: {},
            success:function (response) {
                var list = '';
                $.each(response.data, function (index, value) {
                    list += '<option value="'+value.id+'">'+value.kota+'</option>';
                });
                $("#list-kota").html(list);
            }
        });
    }

    $("#search-btn").click(function() {
        var kota = $("#list-kota").val();
        $.ajax({
            url: '/api/search/' + kota,
            type: 'GET',
            dataType: 'json',
            data: {},
            success:function (response) {
                generateTable(response);
            }
        });

    });

    function generateTable(source) {
        var data = source.data;
        var tanggal = source.date;
        var kota = source.kota;
        var judul = '<h4>Jadwal Bioskop di Kota '+kota+' pada tanggal '+tanggal+'</h4>';
        var list = '';

        $.each(data, function (index, value) {
            var listJadwal = '';
            var jadwal = value.jadwal;
            $.each(jadwal, function (index, value) {
                var listJam = '';
                var jam = value.jam;
                $.each(jam, function (index, value) {
                    listJam += value + '<br />';
                });
                listJadwal += '<tr>' +
                                '<td>'+value.bioskop+'</td>'+
                                '<td>'+value.harga+'</td>'+
                                '<td>'+listJam+'</td>'+
                              '</tr>';
            });
            list += '<div class="col-sm-6"><div class="panel panel-default">'+
                  '<div class="panel-heading">'+value.movie+'</h3></div>'+
                  '<div class="panel-body" style="text-align: left;">'+
                    '<p>Genre : <span class="label label-success">'+value.genre+'</span></p>'+
                    '<p>Durasi : <span class="label label-warning">'+value.duration+'</span></p>'+
                  '</div>'+
                  '<table class="table table-hover table-stripped">'+
                      '<thead>'+
                        '<tr>'+
                            '<th>Bioskop</th>'+
                            '<th>Harga Tiket</th>'+
                            '<th>Jam</th>'+
                        '</tr>'+
                      '</thead>'+
                      '<tbody>'+ listJadwal +'</tbody>'+
                  '</table>'+
                '</div></div>';
        });

        console.log(data);

        $("#judul-jadwal").html(judul);
        $("#list-jadwal").html(list);


    }

    getKota();

});
