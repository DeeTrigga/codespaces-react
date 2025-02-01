import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ChatImageRepository from './ChatImageRepository';

describe('ChatImageRepository Component', () => {
  it('renders without crashing', () => {
    render(<ChatImageRepository />);
    expect(screen.getByText('AI Generated Images')).toBeInTheDocument();
  });

  it('initial state is set correctly', () => {
    render(<ChatImageRepository />);
    expect(screen.getByText('Drag and drop images here')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Describe the image you want...')).toBeInTheDocument();
  });

  it('handles reference upload correctly', () => {
    render(<ChatImageRepository />);
    const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
    const input = screen.getByLabelText(/upload/i);
    fireEvent.change(input, { target: { files: [file] } });
    expect(screen.getByAltText('example.png')).toBeInTheDocument();
  });

  it('handles drop event correctly', () => {
    render(<ChatImageRepository />);
    const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
    const dropZone = screen.getByText('Drag and drop images here');
    fireEvent.drop(dropZone, { dataTransfer: { files: [file] } });
    expect(screen.getByAltText('example.png')).toBeInTheDocument();
  });

  it('handles message correctly', async () => {
    render(<ChatImageRepository />);
    const input = screen.getByPlaceholderText('Describe the image you want...');
    fireEvent.change(input, { target: { value: 'Generate an image' } });
    fireEvent.keyUp(input, { key: 'Enter', code: 'Enter' });
    expect(screen.getByText('Generate an image')).toBeInTheDocument();
    await new Promise((r) => setTimeout(r, 2000));
    expect(screen.getByText("I've generated an image based on your request. Would you like to review it for Etsy upload or archive it?")).toBeInTheDocument();
  });

  it('archives selected images correctly', () => {
    render(<ChatImageRepository />);
    const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
    const input = screen.getByLabelText(/upload/i);
    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.click(screen.getByAltText('example.png'));
    fireEvent.click(screen.getByText('Archive Selected'));
    expect(screen.queryByAltText('example.png')).not.toBeInTheDocument();
  });

  it('toggles image selection correctly', () => {
    render(<ChatImageRepository />);
    const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
    const input = screen.getByLabelText(/upload/i);
    fireEvent.change(input, { target: { files: [file] } });
    const image = screen.getByAltText('example.png');
    fireEvent.click(image);
    expect(image.parentElement).toHaveClass('ring-2 ring-blue-500');
    fireEvent.click(image);
    expect(image.parentElement).not.toHaveClass('ring-2 ring-blue-500');
  });
});