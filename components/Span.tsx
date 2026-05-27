import { View, Text, TextProps } from 'react-native'
import React from 'react'

const Span = ({ children,style,fontWeight="regular",...rest }: 
  { 
    children: React.ReactNode,
    fontWeight?:"regular"|"bold"
 }&TextProps) => {
  return (
      <Text style={[{ color: '#ffffff' ,fontFamily: fontWeight === 'bold' ? 'CustomFont-Bold' : 'CustomFont-Regular'},style]} {...rest}>{children}</Text>
  )
}

export default Span