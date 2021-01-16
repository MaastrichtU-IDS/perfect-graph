import React from 'react'
import { DataRender, wrapComponent } from 'colay-ui'
import { ComponentType } from 'colay-ui/type'

export type DynamicRenderData = {
  type?: string;
  props?: Record<string, any>;
  children?: DynamicRenderData[];
  component?: React.ReactNode;
}

export type DynamicRenderProps = {
  data: DynamicRenderData[];
  components: Record<string, ComponentType>;
}

const DynamicRenderElement = (props: DynamicRenderProps) => {
  const {
    data,
    components,
  } = props
  return (
    <DataRender
      accessor={['children']}
      // @ts-ignore
      data={data}
      renderItem={({ item, children }) => {
        // @ts-ignore
        if (item.component) {
          // @ts-ignore
          return item.component
        }
        // @ts-ignore
        const ItemComponent = components[item?.type!]
        return (
          <ItemComponent
          // @ts-ignore
            {...item?.props}
          >
            {
              React.Children.map(
                children,
                // @ts-ignore
                (child, index) => item.children?.[index].component ?? child,
              )
            }
          </ItemComponent>
        )
      }}
    />
  )
}

export const DynamicRender = wrapComponent<DynamicRenderProps>(
  DynamicRenderElement,
)
