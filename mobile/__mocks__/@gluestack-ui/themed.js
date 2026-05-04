const React = require("react");
const { View, Text, Pressable, ScrollView, TextInput } = require("react-native");

function Box({ children, ...props }) {
  return React.createElement(View, props, children);
}

function VStack({ children, ...props }) {
  return React.createElement(View, props, children);
}

function HStack({ children, ...props }) {
  return React.createElement(View, props, children);
}

function Input({ children, ...props }) {
  return React.createElement(View, props, children);
}

function InputField(props) {
  return React.createElement(TextInput, props);
}

function Textarea({ children, ...props }) {
  return React.createElement(View, props, children);
}

function TextareaInput(props) {
  return React.createElement(TextInput, props);
}

function Button({ children, onPress, ...props }) {
  return React.createElement(
    Pressable,
    { onPress, accessibilityRole: "button", ...props },
    children,
  );
}

function ButtonText({ children, ...props }) {
  return React.createElement(Text, props, children);
}

function Card({ children, ...props }) {
  return React.createElement(View, props, children);
}

function useToken() {
  return "#525252";
}

module.exports = {
  GluestackUIProvider: ({ children }) => React.createElement(React.Fragment, null, children),
  Box,
  VStack,
  HStack,
  Pressable,
  Text,
  ScrollView,
  Input,
  InputField,
  Textarea,
  TextareaInput,
  Button,
  ButtonText,
  Card,
  useToken,
};
