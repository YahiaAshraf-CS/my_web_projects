class SortingVisualizer {
    constructor() {
       
        this.array = [];
      
        this.bars = [];
        
        this.arraySize = 50; 
       
        this.isSorting = false;
       
        this.speed = 5; 

        
        this.barsContainer = document.getElementById('bars');
        this.generateBtn = document.getElementById('generateBtn');
        this.sortBtn = document.getElementById('sortBtn');
        this.stopBtn = document.getElementById('stop');
        this.resetBtn = document.getElementById('reset');
        this.speedSlider = document.getElementById('speed');
        
        this.algorithmRadios = document.querySelectorAll('input[name="algorithm"]');
       
        this.generateBtn.addEventListener('click', () => this.generateArray());
        this.sortBtn.addEventListener('click', () => this.startSorting());
        this.speedSlider.addEventListener('input', (e) => this.speed = parseInt(e.target.value));
        this.stopBtn.addEventListener('click', () => this.stopSorting());
        this.resetBtn.addEventListener('click', () => this.resetSorting());
       
        this.shouldStop = false;
       
        this.generateArray();
    }

    
    generateArray() {
        
        if (this.isSorting) return;

       
        this.bars.forEach(bar => {
            bar.classList.remove('sorted', 'comparing');
        });

        
        this.array = Array.from({ length: this.arraySize },
            () => Math.floor(Math.random() * 300) + 50); 
       
        this.drawBars();
    }

    
    drawBars() {
      
        this.barsContainer.innerHTML = '';
        this.bars = [];

       
        const containerWidth = this.barsContainer.offsetWidth || 900; 
        const barWidth = Math.max(6, Math.floor(containerWidth / this.arraySize) - 2); 

       
        this.array.forEach((value, index) => {
            const bar = document.createElement('div');
          
            bar.className = 'bar';
            
            bar.style.height = `${value}px`;
            
            bar.style.width = `${barWidth}px`; 
            
            this.barsContainer.appendChild(bar);
          
            this.bars.push(bar);
        });
    }
    async stopSorting() {
        this.shouldStop = true;
        this.isSorting = false;
        this.generateBtn.disabled = false;
        this.sortBtn.disabled = false;
        this.algorithmRadios.forEach(radio => radio.disabled = false);
    }
      async resetSorting() {
        this.shouldStop = true;
        this.isSorting = false;
        this.generateBtn.disabled = false;
        this.sortBtn.disabled = false;
        this.algorithmRadios.forEach(radio => radio.disabled = false);
        this.generateArray();
      }
    
    async startSorting() {
        if (this.isSorting) return;

        this.shouldStop = false;
        this.isSorting = true;
        this.generateBtn.disabled = true;
        this.sortBtn.disabled = true;
        this.algorithmRadios.forEach(radio => radio.disabled = true);

        this.bars.forEach(bar => bar.classList.remove('sorted'));

        const algorithm = document.querySelector('input[name="algorithm"]:checked').value;

        try {
            switch (algorithm) {
                case 'bubble':
                    await this.bubbleSort();
                    break;
                case 'selection':
                    await this.selectionSort();
                    break;
                case 'merge':
                    await this.mergeSort();
                    break;
                case 'quick':
                    await this.quickSort();
                    break;
                case 'insertion':
                    await this.insertionSort();
                    break;
            }
        } catch (error) {
            console.log('Sorting stopped');
        }

        if (!this.shouldStop) {
            this.bars.forEach(bar => bar.classList.add('sorted'));
        }
        
        this.isSorting = false;
        this.generateBtn.disabled = false;
        this.sortBtn.disabled = false;
        this.algorithmRadios.forEach(radio => radio.disabled = false);
    }
    

    async sleep() {
        if (this.shouldStop) {
            throw new Error('Sorting stopped');
        }
        const delay = 1000 / this.speed;
        return new Promise(resolve =>
            setTimeout(resolve, delay));
    }

  

   
    async bubbleSort() {
       
        const n = this.array.length;

       
        for (let i = 0; i < n; i++) {
           
            for (let j = 0; j < n - i - 1; j++) {
                
                this.bars[j].classList.add('comparing');
                this.bars[j + 1].classList.add('comparing');
                
                await this.sleep();

              
                if (this.array[j] > this.array[j + 1]) {
                    
                    [this.array[j], this.array[j + 1]] = [this.array[j + 1], this.array[j]];
                    
                    this.bars[j].style.height = `${this.array[j]}px`;
                    this.bars[j + 1].style.height = `${this.array[j + 1]}px`;
                }

                
                this.bars[j].classList.remove('comparing');
                this.bars[j + 1].classList.remove('comparing');
            }
            
            this.bars[n - i - 1].classList.add('sorted');
        }
    }

   
    async selectionSort() {
      
        const n = this.array.length;

      
        for (let i = 0; i < n; i++) {
         
            let minIdx = i;

            this.bars[minIdx].classList.add('comparing');

            
            for (let j = i + 1; j < n; j++) {
                
                this.bars[j].classList.add('comparing');
              
                await this.sleep();

               
                if (this.array[j] < this.array[minIdx]) {
                    
                    if (minIdx !== i) {
                        this.bars[minIdx].classList.remove('comparing');
                    }
                  
                    minIdx = j;
                    
                    this.bars[minIdx].classList.add('comparing');
                } else {
                 
                    this.bars[j].classList.remove('comparing');
                }
            }

            
            this.bars[minIdx].classList.remove('comparing');


            
            if (minIdx !== i) {
              
                [this.array[i], this.array[minIdx]] = [this.array[minIdx], this.array[i]];
               
                this.bars[i].style.height = `${this.array[i]}px`;
                this.bars[minIdx].style.height = `${this.array[minIdx]}px`;

               
                 this.bars[i].classList.add('comparing');
                 this.bars[minIdx].classList.add('comparing');
                 await this.sleep();
                 this.bars[i].classList.remove('comparing');
                 this.bars[minIdx].classList.remove('comparing');

            }

         
            this.bars[i].classList.add('sorted');
        }
    }

   
    async mergeSort() {
        
        await this.mergeSortHelper(0, this.array.length - 1);
         
         this.bars.forEach(bar => bar.classList.add('sorted'));
    }

    
    async mergeSortHelper(start, end) {
        
        if (start >= end) return;

        
        const mid = Math.floor((start + end) / 2);
      
        await this.mergeSortHelper(start, mid);
        
        await this.mergeSortHelper(mid + 1, end);
        
        await this.merge(start, mid, end);
    }

    
    async merge(start, mid, end) {
        
        const left = this.array.slice(start, mid + 1);
        const right = this.array.slice(mid + 1, end + 1);
        
        let i = 0, j = 0, k = start;

        
        while (i < left.length && j < right.length) {
             
             this.bars[start + i].classList.add('comparing');
             this.bars[mid + 1 + j].classList.add('comparing');
             
             await this.sleep();

         
            if (left[i] <= right[j]) {
                this.array[k] = left[i];
                i++;
            } else {
                this.array[k] = right[j];
                j++;
            }
         
             this.bars[k].style.height = `${this.array[k]}px`;
             
             this.bars[start + i -1]?.classList.remove('comparing');
             this.bars[mid + 1 + j -1]?.classList.remove('comparing');

          
            k++;
          
             await this.sleep();

        }

  
        while (i < left.length) {
            this.array[k] = left[i];
            this.bars[k].style.height = `${this.array[k]}px`;
             this.bars[start + i].classList.remove('comparing');
            i++;
            k++;
             await this.sleep();
        }
        while (j < right.length) {
            this.array[k] = right[j];
            this.bars[k].style.height = `${this.array[k]}px`;
            this.bars[mid + 1 + j].classList.remove('comparing');
            j++;
            k++;
             await this.sleep();
        }

      

      
        for(let x = start; x <= end; x++) {
             this.bars[x].classList.remove('comparing');
        }
    }


  
    async quickSort() {
        await this.quickSortHelper(0, this.array.length - 1);
         this.bars.forEach(bar => bar.classList.add('sorted'));
    }

    async quickSortHelper(low, high) {
        if (low < high) {
            const pi = await this.partition(low, high);
            await this.quickSortHelper(low, pi - 1);
            await this.quickSortHelper(pi + 1, high);
        }
    }

    async partition(low, high) {
        const pivot = this.array[high];
        this.bars[high].classList.add('comparing');
        await this.sleep();

        let i = low - 1;

        for (let j = low; j < high; j++) {
            this.bars[j].classList.add('comparing');
            await this.sleep();

            if (this.array[j] < pivot) {
                i++;
                [this.array[i], this.array[j]] = [this.array[j], this.array[i]];
                this.bars[i].style.height = `${this.array[i]}px`;
                this.bars[j].style.height = `${this.array[j]}px`;
                 this.bars[i].classList.add('comparing');
                 this.bars[j].classList.add('comparing');
                 await this.sleep();
                 this.bars[i].classList.remove('comparing');
                 this.bars[j].classList.remove('comparing');
            }

            this.bars[j].classList.remove('comparing');
        }

        [this.array[i + 1], this.array[high]] = [this.array[high], this.array[i + 1]];
        this.bars[i + 1].style.height = `${this.array[i + 1]}px`;
        this.bars[high].style.height = `${this.array[high]}px`;

        this.bars[i + 1].classList.add('comparing');
        this.bars[high].classList.add('comparing');
        await this.sleep();
        this.bars[i + 1].classList.remove('comparing');
        this.bars[high].classList.remove('comparing');

        return i + 1;
    }

    async insertionSort() {
        let i, j, key;
        const n = this.array.length;
        for (i = 1; i < n; i++) {
            key = this.array[i]; 
            j = i - 1; 

           
            this.bars[i].classList.add('comparing');
            await this.sleep();

          
            while (j >= 0 && key < this.array[j]) {
            
                this.bars[j].classList.add('comparing');
                this.bars[j + 1].classList.add('comparing');
                await this.sleep();

                this.array[j + 1] = this.array[j];
                this.bars[j + 1].style.height = `${this.array[j + 1]}px`; 

                this.bars[j].classList.remove('comparing');
                this.bars[j + 1].classList.remove('comparing');

                j = j - 1; 
            }
            this.array[j + 1] = key; 
            this.bars[j + 1].style.height = `${this.array[j + 1]}px`;

            
            this.bars[i].classList.remove('comparing');

            
        }
    
    this.bars.forEach(bar => bar.classList.add('sorted'));
}
  
   
    


}


window.addEventListener('load', () => {
    new SortingVisualizer();
});