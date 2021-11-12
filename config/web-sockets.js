import io from 'socket.io-client';

const STRAPI_ENDPOINT = 'https://pcmjourney.herokuapp.com';
export const socket = io(STRAPI_ENDPOINT);