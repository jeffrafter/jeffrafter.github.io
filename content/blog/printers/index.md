---
title: Printers
date: '2024-02-16T00:01:00'
published: false
slug: printers
layout: post
tags: ['markdown']
category: hacks
excerpt: When the economy crashes and the world ends you'll find us all trading ink cartridges for currency.
---

When the economy crashes and the world ends you'll find us all trading ink cartridges for currency. Until then, you probably want to make amazing prints of your favorite projects and if you are like me you are afraid to spend the ink.

When I was working on my PhotoBooth project I found myself iterating on the print-out design. I'd done the math and figured out that each print on my photo printer would cost me just under $1.00. I was not going to print 1000 copies of my design to get it right. I needed a way to print to a PDF to test my designs.

Instead of solving the problem in code I found myself solving it in the printer. I had to figure out how to print to a PDF. If I could do it over again I would have solved the problem in code and just rendered the PDF and sent it to a file.

## Fake printers are like real printers

My real printer connects to my WiFi (after an incredible number of strange key-presses) and has a Bonjour name. I can print to it from my phone, my laptop, and my desktop. I can also print to it from my server. I can print to it from anywhere on my network.

Bonjour is Apple's implementation of Zeroconf or multicast DNS. It's a way for devices to find each other on a network, including printers, and advertise their services.

Now, all I needed was a fake printer I could install onto my Mac. It turns out [PDFwriter](https://github.com/rodyager/RWTS-PDFwriter) is exactly that. It's a printer driver that prints to a PDF.

[Download](https://github.com/rodyager/RWTS-PDFwriter/releases/download/v3.1/RWTS-PDFwriter.pkg) the package and install it.

![PDFWriter Printer](../../assets/printers-PDFwriter.png)


Then run the PDFWriter Utility to create the destination folder for your PDFs.

![PDFWriter Utility](../../assets/printers-Utility.png)

CUPS
DNS-SD
Bonjour
Docker
CUPS-PDF
Avahi

Docker host networking
https://github.com/docker/for-mac/issues/3926#issuecomment-1760373163

Vagrant
https://github.com/SteveMarshall/home-monitoring/commit/e243139fb02e531205a713228dd3ec73d794f43e
