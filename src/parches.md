```js
function gethtmlNotifications(
  typehtml,
  message,
  messageNotif,
  senderId,
  recipientId,
  notifId
) {
  const notificationsStyles = {
    firstmessage: `<li class="notification unread" id="li-notification" data-sender-id=${senderId} data-recipient-id=${recipientId} data-notif-id=${notifId}>
                    <div class="notification-icon">
                    <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M24 23h-24v-13.275l2-1.455v-7.27h20v7.272l2 1.453v13.275zm-20-10.472v-9.528h16v9.527l-8 5.473-8-5.472zm14-.528h-12v-1h12v1zm0-3v1h-12v-1h12zm-7-1h-5v-3h5v3zm7 0h-6v-1h6v1zm0-2h-6v-1h6v1z"/></svg>
                </div>
                <div class="notification-content">
                    <h2 class="notification-title">Contacto desconocido</h2>
                    <p class="notification-message">${message}</p>
                    <span class="notification-time">${messageNotif}</span>
                </div>
                <div class="notif-read-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24"><path d="M3.875 12.969h-2.854s4.906-8.771 5.511-9.875c.425-.777 1.042-1.094 1.55-1.094.826 0 1.553.899 1.496 2.703-.014.439-.587.36-.578-.031.042-1.776-1.157-1.911-1.604-.838-.968 2.322-2.275 5.849-3.521 9.135zm20.125 1.031l-1 8h-7.607c-.788 0-1.446-.501-1.791-1.209-.402-.827-.874-1.773-1.602-1.773s-1.199.947-1.602 1.773c-.344.708-1.002 1.209-1.791 1.209h-7.607l-1-8h24zm-15 3c0-.552-.447-1-1-1h-4.547c-.734 0-1.13.53-1.059 1.156.072.627.126 1.219.231 1.844.119.707.479 1 1.126 1h4.249c.553 0 1-.448 1-1v-2zm12.605.156c.072-.626-.324-1.156-1.058-1.156h-4.547c-.553 0-1 .448-1 1v2c0 .552.447 1 1 1h4.249c.646 0 1.007-.293 1.126-1 .105-.625.159-1.217.23-1.844zm-6.605-12.484c-.042-1.776 1.157-1.911 1.604-.838.968 2.322 2.274 5.849 3.521 9.135h2.854s-4.906-8.771-5.511-9.875c-.425-.777-1.042-1.094-1.55-1.094-.826 0-1.553.899-1.496 2.703.014.439.587.36.578-.031z"/></svg>
                </div>
                
            </li>`,
    youlike: `<div class="notification-item" id="li-notification" data-sender-id=${senderId} data-recipient-id=${recipientId} data-notif-id=${notifId}>
                    <div class="avatar">O</div>
                    <div class="notification-content">
                        <div class="notification-header">
                            <div class="notification-title">
                                <span class="status-indicator"></span>
                                ObsidianMD
                            </div>
                            <span class="notification-time">4h</span>
                        </div>
                        <div class="notification-text">
                            LifeOS Plugin Open Source Version Q4 Update
                        </div>
                    </div>
                    <div class="menu-button">⋮</div>
                </div>`,

    youlike: `<li class="notification unread" id="li-notification" data-sender-id=${senderId} data-recipient-id=${recipientId} data-notif-id=${notifId}>


                    <div class="notification-icon">
                    <svg xmlns="http://www.w3.org/2000/svg"  width="24" height="24" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
                    </svg>
                </div>
                <div class="notification-content">
                    <h2 class="notification-title">Nuevo Like</h2>
                    <p class="notification-message">${message}</p>
                    <span class="notification-time">${messageNotif}</span>
                </div>
                <div class="notif-read-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24"><path d="M3.875 12.969h-2.854s4.906-8.771 5.511-9.875c.425-.777 1.042-1.094 1.55-1.094.826 0 1.553.899 1.496 2.703-.014.439-.587.36-.578-.031.042-1.776-1.157-1.911-1.604-.838-.968 2.322-2.275 5.849-3.521 9.135zm20.125 1.031l-1 8h-7.607c-.788 0-1.446-.501-1.791-1.209-.402-.827-.874-1.773-1.602-1.773s-1.199.947-1.602 1.773c-.344.708-1.002 1.209-1.791 1.209h-7.607l-1-8h24zm-15 3c0-.552-.447-1-1-1h-4.547c-.734 0-1.13.53-1.059 1.156.072.627.126 1.219.231 1.844.119.707.479 1 1.126 1h4.249c.553 0 1-.448 1-1v-2zm12.605.156c.072-.626-.324-1.156-1.058-1.156h-4.547c-.553 0-1 .448-1 1v2c0 .552.447 1 1 1h4.249c.646 0 1.007-.293 1.126-1 .105-.625.159-1.217.23-1.844zm-6.605-12.484c-.042-1.776 1.157-1.911 1.604-.838.968 2.322 2.274 5.849 3.521 9.135h2.854s-4.906-8.771-5.511-9.875c-.425-.777-1.042-1.094-1.55-1.094-.826 0-1.553.899-1.496 2.703.014.439.587.36.578-.031z"/></svg>
                </div>
            </li>`,

    newcontact: `<li class="notification unread" id="li-notification" data-sender-id=${senderId} data-recipient-id=${recipientId} data-notif-id=${notifId}>
                    <div class="notification-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.5 17.311l-1.76-3.397-1.032.505c-1.12.543-3.4-3.91-2.305-4.497l1.042-.513-1.747-3.409-1.053.52c-3.601 1.877 2.117 12.991 5.8 11.308l1.055-.517z"/></svg>
                </div>
                <div class="notification-content">
                    <h2 class="notification-title">Nuevo Like</h2>
                    <p class="notification-message">${message}</p>
                    <span class="notification-time">${messageNotif}</span>
                </div>
                <div class="notif-read-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24"><path d="M3.875 12.969h-2.854s4.906-8.771 5.511-9.875c.425-.777 1.042-1.094 1.55-1.094.826 0 1.553.899 1.496 2.703-.014.439-.587.36-.578-.031.042-1.776-1.157-1.911-1.604-.838-.968 2.322-2.275 5.849-3.521 9.135zm20.125 1.031l-1 8h-7.607c-.788 0-1.446-.501-1.791-1.209-.402-.827-.874-1.773-1.602-1.773s-1.199.947-1.602 1.773c-.344.708-1.002 1.209-1.791 1.209h-7.607l-1-8h24zm-15 3c0-.552-.447-1-1-1h-4.547c-.734 0-1.13.53-1.059 1.156.072.627.126 1.219.231 1.844.119.707.479 1 1.126 1h4.249c.553 0 1-.448 1-1v-2zm12.605.156c.072-.626-.324-1.156-1.058-1.156h-4.547c-.553 0-1 .448-1 1v2c0 .552.447 1 1 1h4.249c.646 0 1.007-.293 1.126-1 .105-.625.159-1.217.23-1.844zm-6.605-12.484c-.042-1.776 1.157-1.911 1.604-.838.968 2.322 2.274 5.849 3.521 9.135h2.854s-4.906-8.771-5.511-9.875c-.425-.777-1.042-1.094-1.55-1.094-.826 0-1.553.899-1.496 2.703.014.439.587.36.578-.031z"/></svg>
                </div>
            </li>`,
  };

  return notificationsStyles[typehtml];
}
```
