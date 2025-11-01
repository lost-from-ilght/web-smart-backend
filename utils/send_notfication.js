
export const sendPushNotification = async (title, body, pushToken, home_id) => {
    // const pushToken = 'ExponentPushToken[sKwuRbHJL2yRpcfWE8ilj_]';
    const response = await fetch('/api/notification/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pushToken,
        title,
        body,
      }),
    });
    const createNotificationResponse = await fetch('/api/notification/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        home_id,
        title,
        message:body,
      }),
    })
  
    const result = await response.json();
    console.log({"Notificationsent": result, "createdNotfication":createNotificationResponse});
    return ({response, })
  };
  

  // Replace with your push token
  // save noti