"use client"
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Notif, NotificationsClass } from '../../utils/classes/NotificationsClass'
import NotificationViewer from './NotificationViewer'

export const NotificationsManager = () => {
  const [notifications, setNotifications] = useState([] as Notif[])
  const notificationSet = useRef(new Set<string>())
  const removeNotif = useCallback(
    (uid: string) => {
      notificationSet.current.delete(uid)
      NotificationsClass.getInstance().removeNotif(uid)
    },
    [notifications]
  )
  useEffect(() => {
    console.log(`Rendering NotificationsManager`)

    setNotifications(NotificationsClass.getInstance().notifs)
    const notifListener = (notif: Notif) => {
      console.log(`Received notification`, notif)
      if (!notificationSet.current.has(notif.uuid!)) {
        notificationSet.current.add(notif.uuid!)
        setNotifications([...NotificationsClass.getInstance().notifs])
        console.log(`Added notification`, notif)
      }
      // setTimeout(() => {
      //   removeNotif(notif.uuid!)
      // }, notif.duration || 5000)
    }
    const notifRemover = (uid: string) => {
      setNotifications([...NotificationsClass.getInstance().notifs])
    }
    NotificationsClass.getInstance().on('notify', notifListener)
    NotificationsClass.getInstance().on('notifGone', notifRemover)
    return () => {
      NotificationsClass.getInstance().off('notify', notifListener)
      NotificationsClass.getInstance().off('notifGone', notifRemover)
    }
  }, [])

  return (
    <div className={`fixed bottom-0 right-0 flex flex-col m-8 gap-4 z-50`}>
      {/* render first 5 */}
      {notifications.slice(0, 5).map(notification => {
        return (
          <NotificationViewer
            notification={notification}
            dismiss={() => removeNotif(notification.uuid!)}
            key={`notif-${notification.uuid}`}
          />
        )
      })}
    </div>
  )
}
