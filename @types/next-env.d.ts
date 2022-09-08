interface Window {
  // pageviewのため
  gtag(type: 'config', googleAnalyticsId: string, { page_path: string })

  // user_propertiesのため
  gtag(type: 'set', userProperties: string, { user_id: string })

  // eventのため
  gtag(
    type: 'event',
    eventAction: 'editor_send',
    fieldObject: {
      event_label: string
      event_category: string
      value?: string
    },
  )

  gtag(
    command: 'event',
    action: 'test',
    params: {
      id: string
    },
  )

  // テスト
  gtag(command: 'event', event_name: 'button_送信', params: any)
}
