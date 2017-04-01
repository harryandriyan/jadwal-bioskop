'use strict';

const Path = require('path');
const Hapi = require('hapi');
const Hoek = require('hoek');
const Vision = require('vision');
const Inert = require('inert');
const Req = require('superagent');

const server = new Hapi.Server();
server.connection({
    port: 3000,
    host: 'localhost',
    routes: {
        files: {
            relativeTo: Path.join(__dirname, 'assets')
        }
    }
});

server.register(Vision, (err) => {
    Hoek.assert(!err, err);

    server.views({
        engines: {
            html: require('handlebars')
        },
        relativeTo: __dirname,
        path: './views',
        layoutPath: './views/layout'
    });
});

server.register(Inert, () => {});

// Assets Routes
server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
        directory: {
            path: '.',
            redirectToSlash: true,
            index: true
        }
    }
});

// Get Jadwal Bioskop
server.route({
    method: 'GET',
    path: '/api/search/{id}',
    handler: function (request, reply) {
        const accessToken = 'e0eddc52ed696683b57dec6af7f4716d';
        const id = encodeURIComponent(request.params.id);
        const uriGetJadwal = 'http://ibacor.com/api/jadwal-bioskop';

        Req
            .get(uriGetJadwal)
            .query({ k: accessToken, id: id})
            .set('Accept', 'application/json')
            .end(function (error, result) {
                reply(result.text);
            });
    }
});

// Get Daftar Kota
server.route({
    method: 'GET',
    path: '/api/kota',
    handler: function (request, reply) {
        const data = '{"status": "success","data": [{"id": "32","kota": "Ambon"},{"id": "6","kota": "Balikpapan"},{"id": "2","kota": "Bandung"},{"id": "31","kota": "Banjarmasin"},{"id": "1","kota": "Batam"},{"id": "4","kota": "Bekasi"},{"id": "34","kota": "Bengkulu"},{"id": "33","kota": "Binjai"},{"id": "3","kota": "Bogor"},{"id": "8","kota": "Cirebon"},{"id": "9","kota": "Denpasar"},{"id": "38","kota": "Gorontalo"},{"id": "10","kota": "Jakarta"},{"id": "21","kota": "Jambi"},{"id": "37","kota": "Jayapura"},{"id": "43","kota": "Karawang"},{"id": "22","kota": "Lampung"},{"id": "16","kota": "Makassar"},{"id": "18","kota": "Malang"},{"id": "19","kota": "Manado"},{"id": "41","kota": "Mataram"},{"id": "17","kota": "Medan"},{"id": "42","kota": "Padang"},{"id": "35","kota": "Palangkaraya"},{"id": "20","kota": "Palembang"},{"id": "39","kota": "Palu"},{"id": "30","kota": "Pekanbaru"},{"id": "24","kota": "Pontianak"},{"id": "13","kota": "Samarinda"},{"id": "14","kota": "Semarang"},{"id": "40","kota": "Singkawang"},{"id": "12","kota": "Surabaya"},{"id": "29","kota": "Surakarta"},{"id": "15","kota": "Tangerang"},{"id": "36","kota": "Tasikmalaya"},{"id": "23","kota": "Yogyakarta"}]}';
        reply(data);
    }
});

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply.view('index');
    }
});

server.start((err) => {

    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});
