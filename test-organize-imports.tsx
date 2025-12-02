import React from 'react';
import { useState, useEffect } from 'react';
import path from 'path';
import fs from 'fs';
import { unusedFunction } from './unused-module';
import * as unusedModule from './another-unused';
import z from 'z-module';
import a from 'a-module';

export default function TestComponent() {
  const [state, setState] = useState('');
  
  return <div>Test Component</div>;
}
