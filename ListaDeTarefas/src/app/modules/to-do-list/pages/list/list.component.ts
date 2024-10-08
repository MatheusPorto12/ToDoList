import { Component, signal } from '@angular/core';
import { InputAddItemComponent } from '../../components/input-add-item/input-add-item.component';
import { IListItems } from '../../interface/IListItems.interface';
import { JsonPipe } from '@angular/common';
import { InputListItemComponent } from '../../components/input-list-item/input-list-item.component';
import { ELocalStorage } from '../../enum/ELocalStorage.enum';
import Swal from 'sweetalert2';

//components

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [InputAddItemComponent,InputListItemComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  public addItem=signal(true);

  #setListItems = signal<IListItems[]>(this.#parseItems())
  public getListItems=this.#setListItems.asReadonly();

  #parseItems(){
    return JSON.parse(localStorage.getItem(ELocalStorage.MY_LIST)||'[]');
  }

  public getInputAndAddItem(value: IListItems){
    localStorage.setItem(
      ELocalStorage.MY_LIST, JSON.stringify([...this.#setListItems(),value]));


      return this.#setListItems.set(this.#parseItems());
  }

  public listItemStage(value: 'pending' | 'completed'){
  return this.getListItems().filter((res: IListItems)=>{
    if(value==='pending'){
      return !res.checked
    }
    if(value==='completed'){
      return res.checked
    }
    return res;
  })
  }
  public updateItemCheckbox(newItem: {id:string; checked:boolean }){
    this.#setListItems.update((oldValue:IListItems[])=>{
      oldValue.filter(res=>{
       if(res.id===newItem.id){
        res.checked=newItem.checked;
        return res;
       } 
       return res;
      });

      return oldValue;
    });

    return localStorage.setItem('@my-list',
      JSON.stringify(this.#setListItems())
    );

  }

  public updateItemText(newItem:{id:string , value:string}){
    this.#setListItems.update((oldValue:IListItems[])=>{
      oldValue.filter(res=>{
       if(res.id===newItem.id){
        res.value=newItem.value;
        return res;
       } 
       return res;
      });

      return oldValue;
    });

    return localStorage.setItem('@my-list',
      JSON.stringify(this.#setListItems())
    );
  }

  public deleteItemText(id:string){

    Swal.fire({
      title: "Tem certeza ?",
      text: "Você não podera reverter esta ação!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, excluir!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.#setListItems.update((oldValue: IListItems[])=>{
          return oldValue.filter((res)=> res.id !==id);
        })
    
        return localStorage.setItem(
           '@my-list',
          JSON.stringify(this.#setListItems())
        );}
      });
        
      }  

  

  public deleteAllItems(){

    Swal.fire({
      title: "Tem certeza ?",
      text: "Você não podera reverter esta ação!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, excluir!"
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('@my-list');
        return this.#setListItems.set(this.#parseItems());
  }
        });
      }  
  }

