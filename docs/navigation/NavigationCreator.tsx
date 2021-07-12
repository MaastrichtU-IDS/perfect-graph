import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import * as R from 'colay/ramda'
import { isReact } from 'colay-ui'

const BottomTab = createBottomTabNavigator()

type Pages = Record<string, Pages | React.Component>

export type PagesWrapperProps = {
  pages: Pages;
  LinkingConfiguration: any;
  initialRouteName: string;
  tabBar?: any;
}

type Page = {
  name: string;
  component: React.Component
}
export const NavigationCreator = (props: PagesWrapperProps) => {
  const {
    pages = {},
    initialRouteName,
    LinkingConfiguration,
    tabBar
  } = props
  const pagesList = React.useMemo(() => {
    const list: Page[] = []
    R.traverseJSON(
      pages,
      (value, path) => {
        console.log(path, value, isReact.component(value))
        if (R.is(Function, value) ) {
        // if (isReact.component(value) ) {
          const extractedPath = R.last(path) === 'index'
            ? R.dropLast(1, path)
            : path
          list.push({ name: `${extractedPath.join('/')}`, component: value })
        } else {
          return value
        }
      },
    )
    return list
  }, [pages])
  
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
    >
      <BottomTab.Navigator
        initialRouteName={initialRouteName}
        tabBar={tabBar}
      >
        {
           pagesList.map((page) => (
             <BottomTab.Screen
               {...page}
               component={PageWrapper(page.component)}
             />
           ))
        }
      </BottomTab.Navigator>
    </NavigationContainer>
  )
}

const PageWrapper = (Page) => (props) => {
  // const router = useRouter()
  return (
    <Page 
      // router={router}
      {...props}
    />
  )

}
// const PageWrapper = (Page) => (props) => {
//   const router = useRouter()
//   return (
//     <Page 
//       router={router}
//       {...props}
//     />
//   )

// }