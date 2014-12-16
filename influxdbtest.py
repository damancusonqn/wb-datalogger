import argparse

from influxdb import InfluxDBClient


def main(host='localhost', port=8086):
    user = 'python'
    password = 'qwe123'
    dbname = 'wunderbar'
    query = 'select column_one from foo;'
    json_body = [{
        "points": [
            ["1", 1, 1.0],
            ["2", 2, 2.0]
        ],
        "name": "foo",
        "columns": ["column_one", "column_two", "column_three"]
    }]

    client = InfluxDBClient(host, port, user, password, dbname)

    print("Write points: {0}".format(json_body))
    client.write_points(json_body)

    print("Queying data: " + query)
    result = client.query(query)

    print("Result: {0}".format(result))


def parse_args():
    parser = argparse.ArgumentParser(
        description='example code to play with InfluxDB')
    parser.add_argument('--host', type=str, required=False, default='localhost',
                        help='hostname of InfluxDB http API')
    parser.add_argument('--port', type=int, required=False, default=8086,
                        help='port of InfluxDB http API')
    return parser.parse_args()


if __name__ == '__main__':
    args = parse_args()
    main(host=args.host, port=args.port)
