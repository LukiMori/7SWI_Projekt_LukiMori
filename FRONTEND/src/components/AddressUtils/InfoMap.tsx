import {useEffect, useRef} from 'react';
import {MAP_API_KEY, MAP_API_URL} from './../../constants';
import maplibregl from 'maplibre-gl';
import {Container, Row, Col} from 'react-bootstrap';
import 'maplibre-gl/dist/maplibre-gl.css';

interface IInfoMapProps {
    longitude: number;
    latitude: number;
    lang: string;
}

export default function InfoMap({longitude, latitude, lang}: IInfoMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mapRef.current) return;

        const map = new maplibregl.Map({
            container: mapRef.current,
            style: {
                version: 8,
                sources: {
                    turist: {
                        type: 'raster',
                        attribution:
                            '<a href="https://licence.mapy.cz/?doc=mapy_pu#api" target="_blank">&copy; Seznam.cz a.s. a další</a>',
                        minzoom: 1,
                        maxzoom: 19,
                        tiles: [
                            `${MAP_API_URL}/maptiles/outdoor/256@2x/{z}/{x}/{y}?lang=${lang}&apikey=${MAP_API_KEY}`,
                        ],
                        tileSize: 256,
                    },
                },
                layers: [
                    {
                        id: 'maptiles',
                        type: 'raster',
                        source: 'turist',
                        minzoom: 1,
                        maxzoom: 19,
                    },
                ],
            },
            center: [longitude, latitude],
            zoom: 15,
            maxZoom: 19,
            minZoom: 1,
            attributionControl: false,
        });

        map.on('load', () => {
            map.addControl(new maplibregl.AttributionControl({compact: false}), 'bottom-left');
            new maplibregl.Marker().setLngLat([longitude, latitude]).addTo(map);
        });

        return () => {
            map.remove();
        };
    }, [longitude, latitude, lang]);

    return (
        <Container className="my-3">
            <Row>
                <Col>
                    <div
                        ref={mapRef}
                        style={{
                            width: '100%',
                            height: '400px',
                            borderRadius: '0.5rem',
                            overflow: 'hidden',
                            boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                        }}
                    />
                </Col>
            </Row>
        </Container>
    );
}
