import React from 'react';
import { act, create } from 'react-test-renderer';
import DiscoverScreen from '../src/screens/DiscoverScreen';
import { useAppContext } from '../src/context/AppContext';

jest.mock('react-native', () => ({
  FlatList: 'FlatList', Pressable: 'Pressable', RefreshControl: 'RefreshControl',
  Text: 'Text', TextInput: 'TextInput', View: 'View',
  StyleSheet: { create: (styles) => styles },
}));
jest.mock('react-native-safe-area-context', () => ({ SafeAreaView: 'SafeAreaView' }));
jest.mock('@rneui/themed', () => ({ Text: 'Text', createTheme: (theme) => theme }));
jest.mock('@expo/vector-icons', () => ({ MaterialCommunityIcons: 'Icon' }));
jest.mock('../src/components/EventCard', () => 'EventCard');
jest.mock('../src/components/EmptyState', () => 'EmptyState');
jest.mock('../src/context/AppContext', () => ({ useAppContext: jest.fn() }));
jest.mock('../src/services/eventService', () => ({ refreshEvents: jest.fn() }));

global.IS_REACT_ACT_ENVIRONMENT = true;

let screen;
let events;
beforeEach(() => {
  events = [
    { id: 'arts', title: 'Campus Concert', category: 'Arts', startsAt: '2026-10-08T15:00:00Z' },
    { id: 'career', title: 'Campus Career Fair', category: 'Career', startsAt: '2026-10-06T15:00:00Z' },
    { id: 'academic', title: 'Research Talk', category: 'Academic', startsAt: '2026-10-07T15:00:00Z' },
  ];
  useAppContext.mockImplementation(() => ({
    events, setEvents: jest.fn(), savedEventIds: [], toggleSaved: jest.fn(),
  }));
  act(() => { screen = create(<DiscoverScreen navigation={{ navigate: jest.fn() }} />); });
});
afterEach(() => { act(() => screen.unmount()); });

function choose(category) {
  const chip = screen.root.findAllByType('Pressable')
    .find((node) => node.findByType('Text').props.children === category);
  act(() => chip.props.onPress());
  expect(chip.props.accessibilityState.selected).toBe(true);
}
function search(query) {
  act(() => screen.root.findByType('TextInput').props.onChangeText(query));
}
function visibleIds() {
  return screen.root.findByType('FlatList').props.data.map((event) => event.id);
}

test('repeated category presses update the list with unchanged events and query', () => {
  expect(visibleIds()).toEqual(['career', 'academic', 'arts']);
  for (const [category, ids] of [
    ['Arts', ['arts']], ['Career', ['career']], ['Arts', ['arts']],
    ['Workshop', []], ['Academic', ['academic']], ['All', ['career', 'academic', 'arts']],
  ]) {
    choose(category);
    expect(visibleIds()).toEqual(ids);
  }
});

test('search ignores capitalization and surrounding whitespace', () => {
  for (const query of ['campus', 'CAMPUS', '  CaMpUs  ', '\tCAMPUS\n']) {
    search(query);
    expect(visibleIds()).toEqual(['career', 'arts']);
  }
  search('   ');
  expect(visibleIds()).toEqual(['career', 'academic', 'arts']);
});

test('search combines with categories; All preserves search and Clear filters resets both', () => {
  search('  CAMPUS  ');
  choose('Arts');
  expect(visibleIds()).toEqual(['arts']);
  choose('All');
  expect(visibleIds()).toEqual(['career', 'arts']);
  choose('Academic');
  expect(visibleIds()).toEqual([]);
  act(() => screen.root.findByType('FlatList').props.ListEmptyComponent.props.onAction());
  expect(visibleIds()).toEqual(['career', 'academic', 'arts']);
  expect(screen.root.findByType('TextInput').props.value).toBe('');
});

test('replacing context events refreshes results without sorting shared state in place', () => {
  expect(events.map((event) => event.id)).toEqual(['arts', 'career', 'academic']);
  choose('Arts');
  events = [...events, { id: 'new', title: 'Exhibition', category: 'Arts', startsAt: '2026-10-09T15:00:00Z' }];
  act(() => screen.update(<DiscoverScreen navigation={{ navigate: jest.fn() }} />));
  expect(visibleIds()).toEqual(['arts', 'new']);
});
