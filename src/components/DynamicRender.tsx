import React from 'react'
import { DataRender, wrapComponent } from 'unitx-ui'
import { ComponentType } from 'unitx-ui/type'

export type DynamicRenderData = {
  type?: string;
  props?: Record<string, any>;
  children?: DynamicRenderData[];
  component: React.ReactNode;
}

export type DynamicRenderProps = {
  data: DynamicRenderData[];
  components: Record<string, ComponentType>;
  // wrapper:
}

const DynamicRenderElement = (props: DynamicRenderProps) => {
  const {
    data,
    components,
  } = props
  return (
    <DataRender
      accessor={['children']}
      data={data}
      renderItem={({ item, children }) => {
        if (item.component) {
          return item.component
        }
        const ItemComponent = components[item?.type!]
        return (
          <ItemComponent
            {...item?.props}
          >
            {
              React.Children.map(
                children,
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
