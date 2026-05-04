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
};
