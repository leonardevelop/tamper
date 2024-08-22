// ==UserScript==
// @name         Respuesta Rápida de ChatGPT (GPT-3.5)
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Selecciona texto y obtén una respuesta rápida de ChatGPT usando GPT-3.5 Turbo
// @author       Tu Nombre
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @connect      api.openai.com
// ==/UserScript==

(function() {
    'use strict';

    // Crear un botón para activar la consulta a ChatGPT
    const button = document.createElement('button');
    button.textContent = 'Obtener Respuesta de ChatGPT (GPT-3.5)';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '10px';
    button.style.zIndex = 1000;
    document.body.appendChild(button);

    button.addEventListener('click', () => {
        // Obtener el texto seleccionado
        const selectedText = window.getSelection().toString();

        if (!selectedText) {
            alert('Selecciona algún texto primero.');
            return;
        }

        // Solicitar la clave API de OpenAI al usuario
        const apiKey = prompt("Introduce tu clave API de OpenAI:");

        if (!apiKey) {
            alert('Clave API no proporcionada.');
            return;
        }

        // Enviar la solicitud a la API de OpenAI
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://api.openai.com/v1/chat/completions",  // Endpoint correcto para GPT-3.5 Turbo
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            data: JSON.stringify({
                model: 'gpt-3.5-turbo',  // Cambia a 'gpt-3.5-turbo' para usar el modelo GPT-3.5
                messages: [
                    { "role": "user", "content": selectedText }
                ]
            }),
            onload: function(response) {
                if (response.status >= 200 && response.status < 400) {
                    const data = JSON.parse(response.responseText);
                    alert('Respuesta de ChatGPT: ' + data.choices[0].message.content.trim());
                } else if (response.status === 404) {
                    alert('Error 404: La URL solicitada no fue encontrada. Verifica la URL de la API.');
                } else {
                    alert(`Error ${response.status}: ${response.statusText}`);
                }
            },
            onerror: function(err) {
                console.error('Error en la solicitud:', err);
                alert('Error al obtener la respuesta de ChatGPT.');
            }
        });
    });
})();
