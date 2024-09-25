import browser from "webextension-polyfill";

// Define the message structure explicitly
interface WebSisMessage {
  action: string;
  sisCode: string;
  password: string;
  day: string;
  month: string;
  year: string;
}

browser.runtime.onInstalled.addListener((details) => {
  console.log("Extension installed:", details);
});

// Escuchar mensajes desde la ventana emergente
browser.runtime.onMessage.addListener(async (message: WebSisMessage, sender) => {
  if (message.action === "openWebSis") {
    try {
      const tab = await browser.tabs.create({ url: 'https://websis.umss.edu.bo/serv_estudiantes.asp' });

      // Asegúrate de cargar el script después de que la pestaña haya sido creada y cargada
      browser.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
        if (tabId === tab.id && changeInfo.status === 'complete') {
          browser.tabs.onUpdated.removeListener(listener);
          browser.scripting.executeScript({
            target: { tabId: tab.id },
            args: [message.sisCode, message.password, message.day, message.month, message.year],
            func: async (sisCode: string, password: string, day: string, month: string, year: string) => {
              try {
                const sisCodeInput = document.getElementById('idCuenta') as HTMLInputElement | null;
                const passwordInput = document.getElementById('idContrasena') as HTMLInputElement | null;
                const daySelect = document.getElementById('idDia') as HTMLSelectElement | null;
                const monthSelect = document.getElementById('idMes') as HTMLSelectElement | null;
                const yearSelect = document.getElementById('idAnio') as HTMLSelectElement | null;
                const codigoInput = document.getElementById('idCodigo') as HTMLInputElement | null;

                if (!sisCodeInput || !passwordInput || !daySelect || !monthSelect || !yearSelect || !codigoInput) {
                  throw new Error('One or more required fields not found in the document');
                }

                sisCodeInput.value = sisCode;
                passwordInput.value = password;
                daySelect.value = day ?? "02";
                monthSelect.value = month;
                yearSelect.value = year;

                // Simular clic o acción para obtener la imagen
                const imgElement = document.querySelector('img[src="stud_codVerificacion1.asp"]') as HTMLImageElement | null;
                if (!imgElement) {
                  throw new Error('Verification image not found in the document');
                }

                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                  throw new Error('Failed to get canvas context');
                }

                canvas.width = imgElement.width;
                canvas.height = imgElement.height;
                ctx.drawImage(imgElement, 0, 0, imgElement.width, imgElement.height);

                // Convertir el canvas a un archivo PNG
                canvas.toBlob(async (blob) => {
                  if (!blob) {
                    throw new Error('Failed to create blob from canvas');
                  }

                  const formData = new FormData();
                  formData.append('file', blob, 'captured_image.png');

                  // Enviar el archivo al servidor
                  const response = await fetch('http://127.0.0.1:8000/procesar_imagen', {
                    method: 'POST',
                    body: formData,
                  });

                  if (response.ok) {
                    const jsonResponse = await response.json();
                    codigoInput.value = jsonResponse.resultado;
                  } else {
                    throw new Error('Failed to send image to server');
                  }
                }, 'image/png');
              } catch (error) {
                console.error('Error during script execution:', error);
              }
            }
          });
        }
      });
    } catch (error) {
      console.error('Error trying to open WebSis:', error);
    }
  }
});
