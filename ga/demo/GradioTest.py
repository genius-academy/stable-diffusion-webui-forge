import gradio as gr
import numpy as np

def flip_text(x):
    return x[::-1]

def flip_image(x):
    return np.fliplr(x)


with gr.Blocks() as demo:
    gr.Markdown("Flip text or image files using this demo.")
    with gr.Tab("Flip Text"):
        text_input = gr.Textbox()
        text_output = gr.Textbox()
        text_button = gr.Button("Flip")
        text_button.click(flip_text, inputs=text_input, outputs=text_output)
    with gr.Tab("Flip Image"):
        with gr.Row():
            image_input = gr.Image()
            image_output = gr.Image()
        image_button = gr.Button("Flip")
        image_button.click(flip_image, inputs=image_input, outputs=image_output)

    with gr.Accordion("Open for More!"):
        gr.Markdown("Look at me...")

demo.launch(server_port=1234,server_name="127.0.0.1")