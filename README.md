    # edgebench

**Know which export format is actually fastest on the machine you own.**

PyTorch, ONNX, CoreML, TensorRT — everyone claims theirs is fastest. edgebench runs your YOLO model across all of them on your own hardware and tells you the truth: real FPS, real latency, real accuracy delta.

🔗 **Live waitlist:** [edgebench-indol.vercel.app](https://edgebench-indol.vercel.app/)

## Why

Every YOLO user eventually asks "should I export to ONNX or CoreML?" or "does FP16 actually help on my machine?" — and answers it by hand, badly, every single project, then throws the results away. There's no standard, trustworthy way to answer this. edgebench wants to be that — the way Cinebench became the standard answer for "how fast is this CPU."

## Status

🚧 **Pre-launch.** This repo currently contains the waitlist landing page. The CLI tool itself is in active development — join the waitlist above to get notified when it ships.

Planned v1 scope:
- `edgebench run model.pt` — benchmarks your Ultralytics YOLO model across every export format available on your machine (Mac: PyTorch/MPS, ONNX, CoreML — Windows/Linux: PyTorch/CUDA, ONNX)
- `edgebench compare base.pt optimized.pt` — diff report between two models/configs
- Clean terminal output + a markdown benchmark report you can drop straight into a README or paper

## License

MIT

## Author

Built by [Pranaav Shinde](https://github.com/Py528).