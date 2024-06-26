import { Component, OnInit } from '@angular/core';
import { Hero } from '../../interfaces/hero';
import { AsyncPipe, NgIf, TitleCasePipe } from '@angular/common';
import { HeroService } from '../../services/hero.service';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { RouterModule } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { SearchHeroComponent } from '../../components/search-hero/search-hero.component';
import { Dialog } from '../../interfaces/dialog';

@Component({
  selector: 'app-heroes',
  standalone: true,
  imports: [SearchHeroComponent, MatListModule, MatIconModule, MatButtonModule, MatDividerModule, TitleCasePipe, RouterModule, AsyncPipe, NgIf],
  templateUrl: './heroes.component.html',
  styleUrl: './heroes.component.css'
})
export class HeroesComponent implements OnInit {
  public heroes$ = new BehaviorSubject<Hero[]>([]);

  constructor(private heroService: HeroService, private dialog: MatDialog){ }

  ngOnInit(): void {
    this.getHeroes();
  }

  onSearch(term: string){
    this.heroService.searchHeroes(term).subscribe(res => this.heroes$.next(res));
  }

  getHeroes(): void {
    this.heroService.getHeroes().subscribe({
      next: res => this.heroes$.next(res)
    });
  }

  deleteHero(hero: Hero){
    const dataDialog: Dialog = {
      title: 'Delete hero',
      message: `Would you like to delete ${hero.name}?`,
      btnTextCancel: 'Cancel',
      btnTextConfirm: 'Delete'
    };
    const dialogRef = this.dialog.open(DialogComponent, {data: dataDialog, width: '250px'});

    dialogRef.afterClosed().subscribe(accept => {
      if(accept){
        this.heroes$.next(this.heroes$.value.filter(h => h !== hero))
        this.heroService.deleteHero(hero.id).subscribe();
      }
    });
  }
}
