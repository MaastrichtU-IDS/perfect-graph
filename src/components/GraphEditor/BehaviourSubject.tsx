export type Subscription<V> = {
  unsubscribe: () => void
}
export const BehaviorSubject = <T,>(value: T) => {
  type Subscriber = (val: T) => void
  type SubscriptionType = Subscription<T>
  const subject = {
    value,
    subscribers: [] as Subscriber[],
    subscribe: (subscriber: Subscriber): SubscriptionType => {
      subscriber(subject.value)
      subject.subscribers.push(subscriber)
      const subscription = {
        unsubscribe: () => {
          subject.subscribers = subject.subscribers.filter(subscriberItem => subscriberItem !== subscriber)
        }
      }
      return subscription
    },
    next: (nextValue: T) => {
      subject.value = nextValue
      subject.subscribers.forEach(subscriber => {
        subscriber(subject.value)
      })
    }
  }
  return subject
}
